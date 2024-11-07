// orderItemsActions.js

const orderItemsQueries = require('../queries/orderItemsQueries');

// Add an item to an order
const addOrderItemAction = (req, res) => {
  const { orderId, productId, quantity } = req.body;

  // Validate that the required fields exist
  if (!orderId || !productId || !quantity) {
    return res.status(400).send('Missing required fields');
  }

  orderItemsQueries.addOrderItem(orderId, productId, quantity)
    .then(result => res.status(201).send('Order item added successfully'))
    .catch(err => res.status(500).send(err.message));
};

// Get order items by order ID
const getOrderItemsAction = (req, res) => {
  const { orderId } = req.params;

  orderItemsQueries.getOrderItemsByOrderId(orderId)
    .then(items => {
      if (items.length === 0) {
        return res.status(404).send('No items found for this order');
      }
      res.json(items);
    })
    .catch(err => res.status(500).send(err.message));
};

module.exports = {
  addOrderItemAction,
  getOrderItemsAction
};
