const express = require('express');
const router = express.Router();
const orderActions = require('../actions/orderActions');

// Route for getting all orders
router.get('/', orderActions.getOrders);

// Route for getting a single order by ID
router.get('/:id', orderActions.getOrderById);

// Route for adding a new order
router.post('/', orderActions.addOrder);

// Route for adding a product to an order
router.post('/:orderId/products', orderActions.addProductToOrder);

// Route for updating an order by ID
router.put('/:id', orderActions.updateOrder);

// DELETE request to remove products from an order
router.delete('/:orderId', orderActions.deleteProductsFromOrderAction);

// Route for deleting all products from an order
router.delete('/:orderId/products', orderActions.deleteProductsFromOrder);

// DELETE request to remove an order (including its associated products)
router.delete('/:orderId', orderActions.deleteOrderAction);

// Route for getting products by order ID
router.get('/:orderId/products', orderActions.getProductsByOrderId);

// Endpoint to get order details by order ID, including products
router.get('/order/:id', orderActions.getOrderDetailsById);

// Get order details by order ID
router.get('/:orderId', orderActions.getOrderDetailsAction);

// Get orders by user ID
router.get('/user/:userId', orderActions.getOrdersByUserIdAction);

// POST request to add a new order with products
router.post('/', orderActions.addOrderAction);

// GET request to fetch the number of orders for a customer by customerId
router.get('/count/:customerId', orderActions.getOrderCountByCustomerAction);

module.exports = router;
