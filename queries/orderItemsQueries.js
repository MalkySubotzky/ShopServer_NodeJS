// orderItemsQueries.js

const promiseConnection = require('../database/sqlConnection'); // חיבור למסד הנתונים

// Add an item to the order
const addOrderItem = (orderId, productId, quantity) => {
  const query = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)';
  return promiseConnection.query(query, [orderId, productId, quantity])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error adding order item: ' + err);
    });
};

// Get all items of an order by order ID
const getOrderItemsByOrderId = (orderId) => {
  const query = `
    SELECT oi.order_id, oi.product_id, oi.quantity, p.name, p.price, p.description
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?;
  `;
  return promiseConnection.query(query, [orderId])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error fetching order items: ' + err);
    });
};

module.exports = {
  addOrderItem,
  getOrderItemsByOrderId
};
