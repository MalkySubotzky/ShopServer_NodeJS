const productQueries = require('../queries/productQueries');

// Get all products from the database
const getProducts = (req, res) => {
  productQueries.getAllProducts()
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err));
};

// Add a new product to the database
const addProduct = (req, res) => {
    const { name, price, description, image, inStock } = req.body;
  
    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).send('Invalid product name');
    }
  
    if (isNaN(price) || price <= 0) {
      return res.status(400).send('Invalid product price');
    }
  
    if (!image || typeof image !== 'string' || image.trim() === '') {
      return res.status(400).send('Invalid product image');
    }
  
    // Call the query to add the product
    productQueries.addProduct(name, price, description, image, inStock)
      .then(result => {
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
      })
      .catch(err => {
        res.status(500).send('Error adding product: ' + err.message);
    });
};

// Update an existing product by ID
const updateProduct = (req, res) => {
    const { name, price, description, image, inStock } = req.body;
    const productId = req.params.id;
  
    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).send('Invalid product name');
    }
  
    if (isNaN(price) || price <= 0) {
      return res.status(400).send('Invalid product price');
    }
  
    if (!image || typeof image !== 'string' || image.trim() === '') {
      return res.status(400).send('Invalid product image');
    }
  
    // Call the query to update the product
    productQueries.updateProduct(productId, name, price, description, image, inStock)
      .then(result => {
        if (result.affectedRows > 0) {
          res.send('Product updated successfully');
        } else {
          res.status(404).send('Product not found');
        }
      })
      .catch(err => {
        res.status(500).send('Error updating product: ' + err.message);
      });
  };

// Delete a product by ID
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  productQueries.deleteProduct(productId)
    .then(result => res.send('Product deleted successfully'))
    .catch(err => res.status(500).send(err));
};

// Get products by order ID
const getProductsByOrderId = (req, res) => {
    const orderId = req.params.id; // get order ID from URL params
  
    // Call the query to fetch products for the order
    productQueries.getProductsByOrderId(orderId)
      .then(products => {
        if (products.length > 0) {
          res.json(products); // Return the products if found
        } else {
          res.status(404).send('No products found for this order');
        }
      })
      .catch(err => {
        res.status(500).send('Error fetching products: ' + err.message);
      });
  };
  

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByOrderId,
  
};
