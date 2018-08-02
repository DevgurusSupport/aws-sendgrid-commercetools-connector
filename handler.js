import { client } from './clients/commercetools';
import { sendEmail } from './services/sendgrid';
import {
  checkIfCustomerExists,
  generateResetPasswordToken,
} from './services/commercetools';

export const lambda = async (event, _) => {
  const message = event.Records[0].Sns.Message;

  if (!message) {
    console.error(
      `Could not extract the message from the event: ${JSON.stringify(event)}`
    );
    return;
  }
  await sendEmail({
    ...JSON.parse(message),
    fromEmail: process.env.FROM_EMAIL_ADDRESS,
  });
};

export const resetPassword = async (event, _) => {
  let response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Reset password request completed' }),
  };
  const body = JSON.parse(event.body);
  try {
    const exists = await checkIfCustomerExists(body.email, client);
    if (!exists) {
      response = {
        statusCode: 404,
        body: JSON.stringify({ message: `Customer ${body.email} not found!` }),
      };
    } else {
      const token = await generateResetPasswordToken(body.email, client);
      await sendEmail({
        type: 'ResetPassword',
        email: body.email,
        token,
        fromEmail: process.env.FROM_EMAIL_ADDRESS,
        resetPasswordUrlPrefix: process.env.RESET_PASSWORD_URL_PREFIX,
      });
    }
  } catch (ex) {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Some unexpected error occured, check logs',
      }),
    };
  } finally {
    return response;
  }
};
