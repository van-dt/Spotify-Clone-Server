import { Logger } from '@nestjs/common';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

const logger = new Logger('SendgripService');

interface IMailParams {
  to: string | string[];
  title: string;
  content: string;
}

export default function sendgripMail({ to, title, content }: IMailParams) {
  const apiKey = process.env.SENDGRID_APIKEY;
  const address = process.env.SENDGRID_ADDRESS;
  const fromName = process.env.SENDGRID_FROM_NAME;

  sgMail.setApiKey(apiKey);

  const msg: MailDataRequired | MailDataRequired[] = {
    to,
    from: {
      email: address,
      name: fromName,
    },
    subject: title,
    text: content,
    html: content,
  };

  (async () => {
    try {
      await sgMail.send(msg);
      logger.log(`Send Mail to ${to} success!`);
    } catch (error) {
      console.error(error);

      if (error[`response`]) {
        console.error(error[`response`].body);
        logger.error(error?.[`response`]?.body || error);
      }
    }
  })();
}
