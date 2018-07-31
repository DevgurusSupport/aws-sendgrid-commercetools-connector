export const buildMessage = msg => {
  // TODO to be completed
  switch (msg.type) {
    case 'CustomerCreated':
      return generateCustomerCreatedMessage(msg);
    default:
      console.warn(`Ignoring message: ${JSON.stringify(msg)}`);
      return null;
  }
};

const generateCustomerCreatedMessage = msg => ({
  to: msg.customer.email,
  from: msg.fromEmail,
  subject: `Welcome ${msg.customer.firstName || 'user'}`,
  html: 'Hey user, thanks for registering!',
  // in case you use a template, set the id here
  // templateId: '',
  substitutions: {
    email: msg.customer.email,
    firstName: msg.customer.firstName,
  },
});
