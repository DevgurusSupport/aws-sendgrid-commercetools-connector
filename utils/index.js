export const buildMessage = msg => {
  // TODO to be completed
  switch (msg.type) {
    case 'CustomerCreated':
      return {
        to: msg.customer.email,
        from: process.env.FROM_EMAIL_ADDRESS,
        subject: `Welcome ${msg.customer.firstName || 'user'}`,
        html: 'Hey user, thanks for registering!',
      };
    default:
      console.warn(`Ignoring message: ${JSON.stringify(msg)}`);
      return null;
  }
};
