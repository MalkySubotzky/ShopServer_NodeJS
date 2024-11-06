const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes for users and products
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
