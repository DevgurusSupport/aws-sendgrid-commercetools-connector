export const buildMessage = msg => {
  // TODO to be completed with other common scenarios
  switch (msg.type) {
    case 'CustomerCreated':
      return generateCustomerCreatedMessage(msg);
    case 'OrderCreated':
      return generateOrderCreatedMessage(msg);
    case 'ResetPassword':
      return generateResetPasswordMessage(msg);
    default:
      console.warn(`Ignoring message: ${JSON.stringify(msg)}`);
      return null;
  }
};

const generateCustomerCreatedMessage = ({ customer, fromEmail }) => ({
  to: customer.email,
  from: fromEmail,
  subject: `Welcome ${customer.firstName || 'user'}`,
  html: 'Hey user, thanks for registering!',
  // in case you use a template, set the id here
  // templateId: '',
  substitutions: {
    email: customer.email,
    firstName: customer.firstName,
  },
});

const generateOrderCreatedMessage = ({ order, fromEmail }) => ({
  to: order.customerEmail,
  from: fromEmail,
  subject: `Your order ${order.orderNumber}`,
  html: 'Order successfully created!',
  // in case you use a template, set the id here
  // templateId: '',
  substitutions: {
    orderNumber: order.orderNumber,
    customerEmail: order.customerEmail,
    totalPrice: order.totalPrice,
  },
});

const generateResetPasswordMessage = ({
  email,
  token,
  fromEmail,
  resetPasswordUrlPrefix,
}) => ({
  to: email,
  from: fromEmail,
  subject: 'Reset Password',
  html: `Here is the link to reset your password <a>${resetPasswordUrlPrefix}${
    token
  }</a>`,
  // in case you use a template, set the id here
  // templateId: '',
  substitutions: {
    email: email,
    token: token,
  },
});
