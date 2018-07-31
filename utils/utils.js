export const buildMessage = msg => {
  // TODO to be completed
  switch (msg.type) {
    case 'CustomerCreated':
      return generateCustomerCreatedMessage(msg);
    case 'OrderCreated':
      return generateOrderCreatedMessage(msg);
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
