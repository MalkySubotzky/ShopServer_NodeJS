const express = require('express');
const router = express.Router();
const productActions = require('../actions/productActions');

// Route for getting all products
router.get('/', productActions.getProducts);

// Route for adding a new product
router.post('/', productActions.addProduct);

// Route for updating a product by ID
router.put('/:id', productActions.updateProduct);

// Route for deleting a product by ID
router.delete('/:id', productActions.deleteProduct);

module.exports = router;
