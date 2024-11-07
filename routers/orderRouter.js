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

// Route for deleting an order by ID
router.delete('/:id', orderActions.deleteOrder);

// Route for deleting all products from an order
router.delete('/:orderId/products', orderActions.deleteProductsFromOrder);

// Route for getting products by order ID
router.get('/:orderId/products', orderActions.getProductsByOrderId);

// Endpoint to get order details by order ID, including products
router.get('/order/:id', orderActions.getOrderDetailsById);

module.exports = router;
