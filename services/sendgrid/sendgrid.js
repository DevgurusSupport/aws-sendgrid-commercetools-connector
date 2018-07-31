import sgMail from '@sendgrid/mail';
import { buildMessage } from '../../utils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async message => {
  const msg = buildMessage(message);
  if (!msg) {
    return;
  }

  try {
    await sgMail.send(msg);
    console.info('Email sent.');
  } catch (ex) {
    console.error(`Error ${ex.message} with code ${ex.code}`);
  }
};
