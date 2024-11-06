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
const addProduct = (name, price) => {
  const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
  return promiseConnection.query(query, [name, price])
    .then(([result]) => result)
    .catch(err => {
      throw new Error('Error adding product: ' + err);
    });
};

// Update an existing product asynchronously by ID
const updateProduct = (name, price, productId) => {
  const query = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
  return promiseConnection.query(query, [name, price, productId])
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

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
