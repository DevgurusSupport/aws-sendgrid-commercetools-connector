import sgMail from '@sendgrid/mail';
import { buildMessage } from './utils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const lambda = async (event, _) => {
  const message = JSON.parse(event.Records[0].Sns.Message);
  if (!message) {
    console.error(
      `Could not extract the message from the event: ${JSON.stringify(event)}`
    );
    return;
  }
  await sendEmail({ ...message, fromEmail: process.env.FROM_EMAIL_ADDRESS });
};

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
