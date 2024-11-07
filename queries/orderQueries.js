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

  // Fetch order details by order ID along with products in the order
const getOrderDetails = (orderId) => {
    const query = `
      SELECT orders.id AS order_id,
             orders.user_id,
             orders.total_price,
             orders.status,
             orders.created_at,
             order_items.quantity,
             products.id AS product_id,
             products.name AS product_name,
             products.price AS product_price,
             products.description AS product_description,
             products.image AS product_image,
             products.in_stock
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      JOIN products ON order_items.product_id = products.id
      WHERE orders.id = ?;
    `;
    return promiseConnection.query(query, [orderId])
      .then(([results]) => results)
      .catch(err => {
        throw new Error('Error fetching order details: ' + err);
      });
  };

  // Fetch all orders by user ID
const getOrdersByUserId = (userId) => {
    const query = `
      SELECT id, user_id, total_price, status, created_at
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC;
    `;
    return promiseConnection.query(query, [userId])
      .then(([results]) => results)
      .catch(err => {
        throw new Error('Error fetching orders by user ID: ' + err);
      });
  };
  
 // Add a new order to the database
const addOrder = (customerId, products) => {
    const query = `
      INSERT INTO orders (customer_id, created_at)
      VALUES (?, NOW());
    `;
    return promiseConnection.query(query, [customerId])
      .then(([result]) => {
        const orderId = result.insertId;  // Get the new order ID
        return { orderId, products };     // Return the new order ID and products for further use
      })
      .catch(err => {
        throw new Error('Error adding order: ' + err);  // Handle errors
      });
  };
  
  // Delete products from order and check the target date to ensure it hasn't passed
const deleteOrderById = (orderId) => {
    const checkOrderQuery = 'SELECT target_date FROM orders WHERE id = ?';  // Query to get the target date for the order
    const deleteOrderQuery = 'DELETE FROM orders WHERE id = ?';  // Query to delete the order itself
    const deleteProductsQuery = 'DELETE FROM order_items WHERE order_id = ?';  // Query to delete associated products
  
    // First, check if the order exists and if the target date has passed
    return promiseConnection.query(checkOrderQuery, [orderId])
      .then(([order]) => {
        if (!order.length) {
          throw new Error('Order not found');
        }
  
        const targetDate = order[0].target_date;
        const currentDate = new Date();
  
        // Compare the target date with the current date
        if (new Date(targetDate) < currentDate) {
          throw new Error('Cannot delete order because the target date has passed');
        }
  
        // Delete products from the order
        return promiseConnection.query(deleteProductsQuery, [orderId])
          .then(() => {
            // After deleting products, delete the order itself
            return promiseConnection.query(deleteOrderQuery, [orderId]);
          });
      })
      .then(([result]) => result)
      .catch(err => {
        throw new Error('Error deleting order: ' + err);
      });
  };

  // Retrieve the number of orders by customer ID
const getOrderCountByCustomerId = (customerId) => {
    const query = 'SELECT COUNT(*) AS order_count FROM orders WHERE customer_id = ?'; // Query to get the number of orders for the specified customer
    return promiseConnection.query(query, [customerId])
      .then(([result]) => result[0].order_count) // Return the count of orders
      .catch(err => {
        throw new Error('Error fetching order count: ' + err); // Error handling
      });
  };
  
  
module.exports = {
  getAllOrders,
  insertOrder,
  addProductToOrder,
  updateOrder,
  deleteOrder,
  deleteProductsFromOrder,
  deleteOrderById,
  getOrderById,
  getProductsByOrderId,
  getOrderDetailsById,
  getOrderDetails,
  getOrdersByUserId,
  addOrder,
  getOrderCountByCustomerId
};
