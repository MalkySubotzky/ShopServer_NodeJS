const { promiseConnection } = require('../config/sqlConnection');

// Fetch all orders asynchronously
const getAllOrders = () => {
  return promiseConnection.query('SELECT * FROM orders')
    .then(([results]) => results)
    .catch(err => {
      throw new Error('Error fetching orders: ' + err);
    });
};

// Add a new order asynchronously
const insertOrder = ({ customerId, targetDate, status }) => {
  const query = 'INSERT INTO orders (customerId, targetDate, status) VALUES (?, ?, ?)';
  return promiseConnection.query(query, [customerId, targetDate, status])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error adding order: ' + err);
    });
};

// Add a product to an order asynchronously
const addProductToOrder = (orderId, productId, quantity) => {
  const query = 'INSERT INTO order_products (orderId, productId, quantity) VALUES (?, ?, ?)';
  return promiseConnection.query(query, [orderId, productId, quantity])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error adding product to order: ' + err);
    });
};

// Update an existing order asynchronously by ID
const updateOrder = (orderId, { targetDate, status }) => {
  const query = 'UPDATE orders SET targetDate = ?, status = ? WHERE id = ?';
  return promiseConnection.query(query, [targetDate, status, orderId])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error updating order: ' + err);
    });
};

// Delete an order asynchronously by ID
const deleteOrder = (orderId) => {
  const query = 'DELETE FROM orders WHERE id = ?';
  return promiseConnection.query(query, [orderId])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error deleting order: ' + err);
    });
};

// Delete all products associated with an order asynchronously
const deleteProductsFromOrder = (orderId) => {
  const query = 'DELETE FROM order_products WHERE orderId = ?';
  return promiseConnection.query(query, [orderId])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error deleting products from order: ' + err);
    });
};

// Fetch a specific order asynchronously by ID
const getOrderById = (orderId) => {
  const query = 'SELECT * FROM orders WHERE id = ?';
  return promiseConnection.query(query, [orderId])
    .then(([result]) => result[0])
    .catch(err => {
      throw new Error('Error fetching order by ID: ' + err);
    });
};

// Fetch all products associated with a specific order asynchronously
const getProductsByOrderId = (orderId) => {
  const query = `
    SELECT p.id, p.name, p.price, op.quantity 
    FROM order_products op
    JOIN products p ON op.productId = p.id
    WHERE op.orderId = ?`;
  return promiseConnection.query(query, [orderId])
    .then(([results]) => results)
    .catch(err => {
      throw new Error('Error fetching products for order: ' + err);
    });
};

// Function to get order details by order ID, including products
const getOrderDetailsById = (orderId) => {
    const query = `
      SELECT 
        o.id AS order_id,
        o.created_at AS order_date,
        o.status AS order_status,
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        p.description AS product_description,
        oi.quantity AS product_quantity
      FROM 
        orders o
      JOIN 
        order_items oi ON o.id = oi.order_id
      JOIN 
        products p ON oi.product_id = p.id
      WHERE 
        o.id = ?
    `;
    
    return promiseConnection.query(query, [orderId])
      .then(([results]) => results)
      .catch(err => {
        throw new Error('Error fetching order details: ' + err);
      });
  };

module.exports = {
  getAllOrders,
  insertOrder,
  addProductToOrder,
  updateOrder,
  deleteOrder,
  deleteProductsFromOrder,
  getOrderById,
  getProductsByOrderId,
  getOrderDetailsById
};
