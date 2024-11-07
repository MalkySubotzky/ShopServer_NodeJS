const { promiseConnection } = require('../config/sqlConnection');

// Fetch all products asynchronously
const getAllProducts = () => {
  return promiseConnection.query('SELECT * FROM products')
    .then(([results]) => results)
    .catch(err => {
      throw new Error('Error fetching products: ' + err);
    });
};

// Add a new product asynchronously
const addProduct = (name, price, description = null, image, inStock = 0) => {
    const query = 'INSERT INTO products (name, price, description, image, in_stock) VALUES (?, ?, ?, ?, ?)';
    return promiseConnection.query(query, [name, price, description, image, inStock])
      .then(([result]) => result)
      .catch(err => {
        throw new Error('Error adding product: ' + err);
    });
};

// Update an existing product asynchronously by ID
const updateProduct = (id, name, price, description = null, image, inStock = 0) => {
    const query = `
      UPDATE products
      SET name = ?, price = ?, description = ?, image = ?, in_stock = ?
      WHERE id = ?
    `;
    return promiseConnection.query(query, [name, price, description, image, inStock, id])
      .then(([result]) => result)
      .catch(err => {
        throw new Error('Error updating product: ' + err);
      });
  };

// Delete a product asynchronously by ID
const deleteProduct = (productId) => {
  const query = 'DELETE FROM products WHERE id = ?';
  return promiseConnection.query(query, [productId])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error deleting product: ' + err);
    });
};

// Function to get products by order ID
const getProductsByOrderId = (orderId) => {
    const query = `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.price AS product_price,
        p.description AS product_description,
        oi.quantity AS product_quantity
      FROM 
        products p
      JOIN 
        order_items oi ON p.id = oi.product_id
      JOIN 
        orders o ON oi.order_id = o.id
      WHERE 
        o.id = ?
    `;
    
    return promiseConnection.query(query, [orderId])
      .then(([results]) => results)
      .catch(err => {
        throw new Error('Error fetching products by order ID: ' + err);
      });
  };

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByOrderId,
};
