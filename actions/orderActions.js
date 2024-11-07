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

// Delete all products for a given order
const deleteProductsFromOrderAction = (req, res) => {
  const { orderId } = req.params;  // Extract orderId from the request parameters

  // Validate that orderId is provided
  if (!orderId) {
    return res.status(400).send('Order ID is required');
  }

  // Delete products associated with the order
  orderQueries.deleteProductsFromOrder(orderId)
    .then(result => {
      // Check if any rows were deleted
      if (result.affectedRows === 0) {
        return res.status(404).send('No products found for the given order ID');
      }
      res.status(200).send('Products deleted successfully');  // Return success message
    })
    .catch(err => {
      res.status(500).send('Error deleting products from order: ' + err);  // Handle errors
    });
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
  
// Get order details by order ID and return the order with product details
const getOrderDetailsAction = (req, res) => {
    const { orderId } = req.params; // קבלת קוד הזמנה מה- URL
    
    orderQueries.getOrderDetails(orderId)
      .then(orderDetails => {
        if (orderDetails.length === 0) {
          return res.status(404).send('Order not found');
        }
        const orderResponse = {
          order: {
            orderId: orderDetails[0].order_id,
            userId: orderDetails[0].user_id,
            totalPrice: orderDetails[0].total_price,
            status: orderDetails[0].status,
            createdAt: orderDetails[0].created_at,
          },
          products: orderDetails.map(item => ({
            productId: item.product_id,
            name: item.product_name,
            price: item.product_price,
            description: item.product_description,
            image: item.product_image,
            inStock: item.in_stock,
            quantity: item.quantity,
          })),
        };
        res.json(orderResponse);
      })
      .catch(err => res.status(500).send(err));
  };

  // Get orders by user ID
const getOrdersByUserIdAction = (req, res) => {
    const { userId } = req.params; 
  
    orderQueries.getOrdersByUserId(userId)
      .then(orders => {
        if (orders.length === 0) {
          return res.status(404).send('No orders found for this user');
        }
        res.json({ orders });
      })
      .catch(err => res.status(500).send(err));
  };
  
// Add an order and its products to the database
const addOrderAction = (req, res) => {
    const { customerId, products } = req.body;  // Extract customer ID and product array from request body
  
    // Validate that customerId and products are provided
    if (!customerId || !products || products.length === 0) {
      return res.status(400).send('Customer ID and at least one product are required');
    }
  
    // Add the order to the orders table
    orderQueries.addOrder(customerId, products)
      .then(({ orderId, products }) => {
        // Add each product to the order
        const productPromises = products.map(product =>
          orderQueries.addProductToOrder(orderId, product.productId, product.quantity)
        );
  
        // Wait for all product insertions to complete
        return Promise.all(productPromises)
          .then(() => res.status(201).json({ message: 'Order and products added successfully', orderId }))
          .catch(err => res.status(500).send('Error adding products to order: ' + err));  // Handle errors in product insertion
      })
      .catch(err => res.status(500).send('Error adding order: ' + err));  // Handle errors in order insertion
  };
  
  // Handle delete order action
const deleteOrderAction = (req, res) => {
    const { orderId } = req.params;  // Extract orderId from the request parameters
  
    // Validate that orderId is provided
    if (!orderId) {
      return res.status(400).send('Order ID is required');
    }
  
    // Call deleteOrderById to delete the order and check if the target date has passed
    orderQueries.deleteOrderById(orderId)
      .then(result => {
        // Check if the order was deleted successfully
        if (result.affectedRows === 0) {
          return res.status(404).send('Order not found');
        }
        res.status(200).send('Order and associated products deleted successfully');
      })
      .catch(err => {
        res.status(500).send('Error deleting order: ' + err);  // Handle errors
      });
  };
  
  // Handle the action to retrieve the number of orders for a given customer
const getOrderCountByCustomerAction = (req, res) => {
    const { customerId } = req.params; // Extract customerId from request parameters
  
    // Validate that the customerId is provided
    if (!customerId) {
      return res.status(400).send('Customer ID is required');
    }
  
    // Call the function to get the order count for the specified customer
    orderQueries.getOrderCountByCustomerId(customerId)
      .then(orderCount => {
        if (orderCount === undefined || orderCount === null) {
          return res.status(404).send('Customer not found or no orders available');
        }
        res.status(200).json({ order_count: orderCount }); // Send the order count as a response
      })
      .catch(err => {
        res.status(500).send('Error fetching order count: ' + err); // Error handling
      });
  };
  
module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteProductsFromOrderAction,
  deleteOrderAction,
  getOrderDetails,
  getOrderDetailsById,
  getOrderDetailsAction,
  getOrdersByUserIdAction,
  addOrderAction,
  getOrderCountByCustomerAction
};
