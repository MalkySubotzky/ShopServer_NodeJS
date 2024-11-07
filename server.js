const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const orderRouter = require('./routers/orderRouter');
const orderItemsRouter = require('./routers/orderItemsRouter');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes for users, products, orders, and order items
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/order-items', orderItemsRouter);

// Additional routes for new functionalities
app.get('/api/orders/customer/:customerId', orderRouter); // Get orders by customer
app.post('/api/orders/:orderId/product', orderRouter); // Add product to order
app.post('/api/orders', orderRouter); // Add a new order
app.delete('/api/orders/:orderId/product', orderRouter); // Delete product from order
app.delete('/api/orders/:orderId', orderRouter); // Delete order by order ID
app.get('/api/orders/customer/:customerId/payments/total', orderRouter); // Get total payments by customer
app.get('/api/orders/customer/:customerId/payments/average', orderRouter); // Get average payment by customer
app.get('/api/orders/total', orderRouter); // Get total number of orders
app.get('/api/orders/date-range', orderRouter); // Get orders in a date range
app.get('/api/orders/cart/:userId', orderRouter); // Get cart by user ID

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
