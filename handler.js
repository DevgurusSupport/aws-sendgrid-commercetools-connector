import { sendEmail } from './services/sendgrid';

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
