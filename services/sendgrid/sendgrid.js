import sgMail from '@sendgrid/mail';
import { buildMessage } from '../../utils';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (
  message,
  populateException = populateSendgridException
) => {
  const msg = buildMessage(message);
  if (!msg) {
    return;
  }

  try {
    await sgMail.send(msg);
    console.info('Email sent.');
  } catch (ex) {
    populateException(ex);
  }
};

export const populateSendgridException = exception => {
  console.error(
    `Sendgrid -> Error ${exception.message} with code ${exception.code}`
  );
  throw exception;
};
