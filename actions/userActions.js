const userQueries = require('../queries/userQueries');

// Get all users from the database
const getUsers = (req, res) => {
  userQueries.getAllUsers()
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err));
};

// Register a new user in the database
const registerUser = (req, res) => {
    const { username, password, email, phone, address } = req.body;
  
    // Check if required fields (username, password, email) are provided
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, password, and email are required." });
    }
  
    // If optional fields (phone, address) are not provided, set them to NULL
    const userPhone = phone || null;
    const userAddress = address || null;
  
    // Call the function in queries to add the new user to the database
    userQueries.addUser(username, password, email, userPhone, userAddress)
      .then(result => {
        // Send success response with userId from the insert operation
        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
      })
      .catch(err => {
        // Handle error and send failure response
        console.error("Error while registering user:", err);
        res.status(500).json({ message: "Failed to register user", error: err });
      });
  };
  

// Login a user by checking credentials
const loginUser = (req, res) => {
  const { username, password } = req.body;
  userQueries.loginUser(username, password)
    .then(user => {
      if (!user) {
        return res.status(401).send('Invalid credentials');
      }
      res.json({ message: 'Login successful' });
    })
    .catch(err => res.status(500).send(err));
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};
