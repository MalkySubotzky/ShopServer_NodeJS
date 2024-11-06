const productQueries = require('../queries/productQueries');

// Get all products from the database
const getProducts = (req, res) => {
  productQueries.getAllProducts()
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err));
};

// Add a new product to the database
const addProduct = (req, res) => {
  const { name, price } = req.body;
  productQueries.addProduct(name, price)
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).send(err));
};

// Update an existing product by ID
const updateProduct = (req, res) => {
  const { name, price } = req.body;
  const productId = req.params.id;
  productQueries.updateProduct(name, price, productId)
    .then(result => res.send('Product updated successfully'))
    .catch(err => res.status(500).send(err));
};

// Delete a product by ID
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  productQueries.deleteProduct(productId)
    .then(result => res.send('Product deleted successfully'))
    .catch(err => res.status(500).send(err));
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
