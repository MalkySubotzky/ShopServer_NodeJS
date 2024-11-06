const userQueries = require('../queries/userQueries');

// Get all users from the database
const getUsers = (req, res) => {
  userQueries.getAllUsers()
    .then(results => res.json(results))
    .catch(err => res.status(500).send(err));
};

// Register a new user in the database
const registerUser = (req, res) => {
  const { username, password, email } = req.body;
  userQueries.addUser(username, password, email)
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).send(err));
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
