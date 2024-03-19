import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EConfiguration } from '@core/config';
import { EEnvironment } from '@core/enum';
import sendMailNodemailer from '@helper/nodemailer';
import sendgripMail from '@helper/sendgrid';

import { EcsService } from '../ecs/ecs.service';

import { VSesWebhookDto } from './dto/ses-webhook.dto';

export type TSendEmailArgs = {
  to: string;
  subject: string;
  body: string;
  mailType?: TMailType;
  meetingId?: string;
  attachmentNoticeEmailId?: string;
  registryId?: string;
  surveyNoticeEmailId?: string;
  header?: string;
  footer?: string;
  introMail?: string;
  outroMail?: string;
};

export type TSendBulkEmailArgs = {
  toAddresses: string[];
  subject: string;
  body: string;
  mailType?: TMailType;
  meetingId?: string;
  attachmentNoticeEmailId?: string;
  registryId?: string;
  surveyNoticeEmailId?: string;
  header?: string;
  footer?: string;
  introMail?: string;
  outroMail?: string;
};

export type TMailType =
  | 'convocationNoticeConfirmation'
  | 'minutesConfirmation'
  | 'writtenResolutionConfirmation'
  | 'electronicSignatureRequest'
  | 'agreementFormSignatureRequest'
  | 'userInvitation'
  | 'adminInvitation'
  | 'minutesRevising'
  | 'minutesConfirmationAllUserDone'
  | 'minutesCommentReminder'
  | 'convocationNoticeConfirmationReminder'
  | 'customMeetingConvocationNoticeConfirmationReminder'
  | 'minutesNoticeConfirmationReminder'
  | 'minutesCommentReminderReply'
  | 'customMeetingMinutesNoticeConfirmationReminder'
  | 'agreementFormSignatureRequestReminder'
  | 'electronicSignatureRequestReminder'
  | 'writtenResolutionElectronicSignatureRequestReminder'
  | 'customMeetingElectronicSignatureRequestReminder'
  | 'attachment'
  | 'attachmentAdmin'
  | 'emailConfirmation'
  | 'transcriptionFailed'
  | 'transcription'
  | 'electronicSignatureRemindMail'
  | 'convocationNoticeRevising'
  | 'surveyPublished'
  | 'surveyReset'
  | 'surveyReminder'
  | 'proposalRevising'
  | 'agreementFormRevising'
  | 'userSecretary'
  | 'registrySignatureRequestEmail'
  | 'registrySignatureRequestEmailReminder'
  | 'registryDocumentRemovalNoticeEmail'
  | 'registryDocumentAdditionNoticeEmail'
  | 'registrySignCompletionNoticeEmail';

type TSnsMessage = {
  eventType: TEventType;
  mail: {
    destination: string[];
    tags: {
      mailType: TMailType[];
      meetingId: string[];
      attachmentNoticeEmailId: string[];
      registryId: string[];
      surveyNoticeEmailId: string[];
    };
  };
};

type TEventType = 'Bounce' | 'Complaint' | 'DeliveryDelay' | 'Reject';

const TARGET_EVENT_TYPES: TEventType[] = [
  'Bounce',
  'Complaint',
  'DeliveryDelay',
  'Reject',
];

@Injectable()
export class SesService {
  private logger: Logger = new Logger('SesService');

  constructor(
    private configService: ConfigService,
    private ecsService: EcsService,
  ) {}

  getClient(): SESClient {
    const client = new SESClient({
      region: this.configService.get(EConfiguration.AWS_REGION),
      credentials: {
        accessKeyId: this.configService.get(EConfiguration.AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(
          EConfiguration.AWS_SECRET_ACCESS_KEY,
        ),
      },
    });

    return client;
  }

  async sendEmail(args: TSendEmailArgs) {
    const {
      to,
      subject,
      body,
      mailType,
      meetingId,
      attachmentNoticeEmailId,
      registryId,
      surveyNoticeEmailId,
      header,
      footer,
      introMail,
      outroMail,
    } = args;

    const ses = this.getClient();

    const sendEmailParams: SendEmailCommandInput = {
      Source: this.configService.get(EConfiguration.AWS_SES_EMAIL),
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data:
              (header || '') +
              (introMail || '') +
              body +
              (outroMail || '') +
              (footer || ''),
            Charset: 'UTF-8',
          },
        },
      },
      Tags: [
        { Name: 'mailType', Value: mailType },
        { Name: 'meetingId', Value: meetingId ?? 'dummyId' },
        {
          Name: 'attachmentNoticeEmailId',
          Value: attachmentNoticeEmailId ?? 'dummyId',
        },
        { Name: 'registryId', Value: registryId ?? 'dummyId' },
        {
          Name: 'surveyNoticeEmailId',
          Value: surveyNoticeEmailId ?? 'dummyId',
        },
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/modules/messagetag.html#value
      ],
    };

    const run = async () => {
      try {
        const data = await ses.send(new SendEmailCommand(sendEmailParams));
        this.logger.log('Success', { data });
      } catch (e) {
        this.logger.log('Error', e);
      }
    };

    await run();

    // send mailhog with develop
    if (
      [EEnvironment.DEVELOPMENT].includes(
        this.configService.get(EConfiguration.ENVIRONMENT),
      )
    ) {
      try {
        const clusterName = 'tera-dev-ecs-cluster';
        const serviceName = 'tera-dev-mailhog';

        let smtp = process.env.MAIL_HOG_HOST;

        if (smtp !== 'localhost') {
          const privateIp = await this.ecsService.getTaskPrivateIp(
            clusterName,
            serviceName,
          );

          if (privateIp) smtp = privateIp;
        }

        sendMailNodemailer({
          to,
          title: subject,
          content:
            (header || '') +
            (introMail || '') +
            body +
            (outroMail || '') +
            (footer || ''),
          host: smtp,
        });
      } catch (error) {
        this.logger.log('SendMailHog Development', error);
      }

      try {
        sendgripMail({
          to,
          title: subject,
          content:
            (header || '') +
            (introMail || '') +
            body +
            (outroMail || '') +
            (footer || ''),
        });
      } catch (error) {
        this.logger.log('SendgripMail Development', error);
      }
    }
  }

  async sendBulkEmail(args: TSendBulkEmailArgs) {
    const {
      toAddresses,
      subject,
      body,
      mailType,
      meetingId,
      attachmentNoticeEmailId,
      registryId,
      surveyNoticeEmailId,
      header,
      footer,
      introMail,
      outroMail,
    } = args;

    const ses = this.getClient();

    const sendEmailParams: SendEmailCommandInput = {
      Source: this.configService.get(EConfiguration.AWS_SES_EMAIL),
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data:
              (header || '') +
              (introMail || '') +
              body +
              (outroMail || '') +
              (footer || ''),
            Charset: 'UTF-8',
          },
        },
      },
      Tags: [
        { Name: 'mailType', Value: mailType },
        { Name: 'meetingId', Value: meetingId ?? 'dummyId' },
        {
          Name: 'attachmentNoticeEmailId',
          Value: attachmentNoticeEmailId ?? 'dummyId',
        },
        { Name: 'registryId', Value: registryId ?? 'dummyId' },
        {
          Name: 'surveyNoticeEmailId',
          Value: surveyNoticeEmailId ?? 'dummyId',
        },
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ses/modules/messagetag.html#value
      ],
    };

    const run = async () => {
      try {
        const data = await ses.send(new SendEmailCommand(sendEmailParams));
        this.logger.log('Success', { data });
      } catch (e) {
        this.logger.log('Error', e);
      }
    };

    await run();

    // send mailhog with develop, staging
    if (
      [EEnvironment.DEVELOPMENT].includes(
        this.configService.get(EConfiguration.ENVIRONMENT),
      )
    )
      try {
        const clusterName = 'tera-dev-ecs-cluster';
        const serviceName = 'tera-dev-mailhog';

        let smtp = process.env.MAIL_HOG_HOST;

        if (smtp !== 'localhost') {
          const privateIp = await this.ecsService.getTaskPrivateIp(
            clusterName,
            serviceName,
          );

          if (privateIp) smtp = privateIp;
        }

        sendMailNodemailer({
          to: toAddresses.join(', '),
          title: subject,
          content:
            (header || '') +
            (introMail || '') +
            body +
            (outroMail || '') +
            (footer || ''),
          host: smtp,
        });
      } catch (error) {
        this.logger.log('SendMailHog Development', error);
      }

    try {
      sendgripMail({
        to: toAddresses,
        title: subject,
        content:
          (header || '') +
          (introMail || '') +
          body +
          (outroMail || '') +
          (footer || ''),
      });
    } catch (error) {
      this.logger.log('SendgripMail Development', error);
    }
  }

  async sesWebhook(body: VSesWebhookDto) {
    const message: TSnsMessage = JSON.parse(body.Records[0].Sns.Message);
    const {
      mail: { destination, tags },
      eventType,
    } = message;

    if (!TARGET_EVENT_TYPES.includes(eventType)) {
      throw new Error('不正なイベント種別です。');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const email = destination[0];
    const mailType = tags.mailType[0];

    try {
      switch (mailType) {
        case 'convocationNoticeConfirmation':
          break;

        default: {
          const unreachableValue: string = mailType;
          throw new HttpException(
            'Case not found: ' + unreachableValue,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      return true;
    } catch (err) {
      this.logger.log('Error', err);
    }
  }
}
