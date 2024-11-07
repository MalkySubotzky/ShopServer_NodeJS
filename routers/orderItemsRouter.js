// orderItemsRouter.js

const express = require('express');
const router = express.Router();
const orderItemsActions = require('../actions/orderItemsActions');

// Route for adding an item to an order
router.post('/add', orderItemsActions.addOrderItemAction);

// Route for getting items by order ID
router.get('/:orderId', orderItemsActions.getOrderItemsAction);

module.exports = router;
