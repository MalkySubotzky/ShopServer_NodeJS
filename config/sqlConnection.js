const mysql = require('mysql2');

// Create a database connection and promisify the connection's query method
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'store',
});

// Check connection
connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected as id ' + connection.threadId);
  });
  
// Promisify the connection's query method
const promiseConnection = connection.promise();

// Export the promisified connection for use in queries
module.exports = {
  promiseConnection,
};