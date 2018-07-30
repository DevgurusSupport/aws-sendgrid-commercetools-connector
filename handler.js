import sgMail from '@sendgrid/mail';
import { buildMessage } from './utils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (event, context) => {
  const message = event.Records[0].Sns.Message;
  if (!message) {
    console.error(
      `Could not extract the message from the event: ${JSON.stringify(event)}`
    );
    return;
  }
  console.info('Building the email ...');
  const msg = buildMessage(message);
  console.log(msg);
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
