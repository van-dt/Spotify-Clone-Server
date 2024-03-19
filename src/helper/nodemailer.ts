/* eslint-disable @typescript-eslint/no-var-requires */
import { Logger } from '@nestjs/common';

const nodeMailer = require('nodemailer');

const mailHost = process.env.MAIL_HOG_HOST;
const mailPort = process.env.MAIL_HOG_PORT;

const logger = new Logger('Nodemailer');

interface IMailParams {
  to: string;
  title: string;
  content: string;
  host?: string;
}

export default function sendMailNodemailer({
  to,
  title,
  content,
  host,
}: IMailParams) {
  const email = process.env.AWS_SES_EMAIL;

  const transporter = nodeMailer.createTransport({
    host: host || mailHost,
    port: mailPort,
  });

  const options = {
    from: email,
    to: to,
    subject: title,
    html: content,
    text: content,
  };

  return transporter
    .sendMail(options)
    .then((_data) => {
      logger.log(`Send Mail to ${to} success!`);
    })
    .catch((error) => {
      logger.error(error?.response?.body || error);
    });
}
