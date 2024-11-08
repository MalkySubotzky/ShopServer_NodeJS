const { promiseConnection } = require('../config/sqlConnection');

// Fetch all users asynchronously
const getAllUsers = () => {
  return promiseConnection.query('SELECT * FROM users')
    .then(([results]) => results )
    .catch(err => {
      throw new Error('Error fetching users: ' + err);
    });
};

// Add a new user asynchronously
const addUser = (username, password, email, phone = null, address = null) => {
    const query = 'INSERT INTO users (username, password, email, phone, address) VALUES (?, ?, ?, ?, ?)';
    
    // Use promise-based query execution to interact with the database
    return promiseConnection.query(query, [username, password, email, phone, address])
      .then(([result]) => result)  
      .catch(err => {  
        throw new Error('Error adding user: ' + err);
      });
  };
  

// User login asynchronously
const loginUser = (username, password) => {
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  return promiseConnection.query(query, [username, password])
    .then(([results]) => (results.length > 0 ? results[0] : null))
    .catch(err => {
      throw new Error('Error during login: ' + err);
    });
};

module.exports = {
  getAllUsers,
  addUser,
  loginUser,
};
