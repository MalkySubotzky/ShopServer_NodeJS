const orderQueries = require('../queries/orderQueries');

// Get all orders from the database
const getOrders = (req, res) => {
  orderQueries.getAllOrders()
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err));
};

// Add a new order to the database
const addOrder = (req, res) => {
  const { customerId, targetDate, status, products } = req.body;
  
  // First, add the order itself
  orderQueries.insertOrder({ customerId, targetDate, status })
    .then(orderResult => {
      // Add the products to the order
      products.forEach(product => {
        orderQueries.addProductToOrder(orderResult.insertId, product.productId, product.quantity)
          .catch(err => res.status(500).send(err));
      });
      res.status(201).json(orderResult);
    })
    .catch(err => res.status(500).send(err));
};

// Update an existing order by ID
const updateOrder = (req, res) => {
  const { targetDate, status } = req.body;
  const orderId = req.params.id;
  
  orderQueries.updateOrder(orderId, { targetDate, status })
    .then(result => res.send('Order updated successfully'))
    .catch(err => res.status(500).send(err));
};

// Delete an order by ID
const deleteOrder = (req, res) => {
  const orderId = req.params.id;
  
  // First, remove products associated with the order
  orderQueries.deleteProductsFromOrder(orderId)
    .then(() => {
      return orderQueries.deleteOrder(orderId);
    })
    .then(result => res.send('Order deleted successfully'))
    .catch(err => res.status(500).send(err));
};

// Get a single order by ID
const getOrderDetails = (req, res) => {
  const orderId = req.params.id;
  
  orderQueries.getOrderById(orderId)
    .then(order => {
      if (!order) {
        return res.status(404).send('Order not found');
      }
      
      orderQueries.getProductsByOrderId(orderId)
        .then(products => {
          order.products = products;
          res.json(order);
        })
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
};

// Get order details by order ID, including products
const getOrderDetailsById = (req, res) => {
    const orderId = req.params.id; // get order ID from URL params
  
    // Call the query to fetch order details and associated products
    orderQueries.getOrderDetailsById(orderId)
      .then(orderDetails => {
        if (orderDetails.length > 0) {
          // Return the order details, including products, if found
          res.json(orderDetails);
        } else {
          res.status(404).send('Order not found');
        }
      })
      .catch(err => {
        res.status(500).send('Error fetching order details: ' + err.message);
      });
  };
  

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrderDetails,
  getOrderDetailsById
};
