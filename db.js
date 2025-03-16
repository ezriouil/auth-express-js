const mysql = require("mysql");
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

/**__ CREATE DATABASE CONNECTION __**/
const createDbConnection = () => {
  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
};

/**__ HANDLE DATABASE CONNECTION __**/
const connectDb = (db) => {
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to the MySQL database");
  });
};

/**__ EXECUTE QUERY __**/
const executeQuery = (db, query, successMessage) => {
  db.query(query, (err, _) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    console.log(successMessage);
  });
};

/**__ CREATE TABLES IF NOT EXISTS __**/
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT 0,
    isAdmin BOOLEAN DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createOtpsTableQuery = `
  CREATE TABLE IF NOT EXISTS otps (
    userId INT NOT NULL,
    otpCode VARCHAR(4) NOT NULL,
    otpType ENUM('EMAIL_VERIFICATION', 'FORGOT_PASSWORD_VERIFICATION') NOT NULL,
    expiredIn TIMESTAMP NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`;

/**__ INITIATE DATABASE CONNECTION AND CREATE TABLES __**/
const db = createDbConnection();
connectDb(db);
executeQuery(db, createUsersTableQuery, "USERS Table created or already exists.");
executeQuery(db, createOtpsTableQuery, "OTP Table created or already exists.");

module.exports = db;