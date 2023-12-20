const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const userDb = {
  define: async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          role VARCHAR(255) DEFAULT 'user',
          uuid VARCHAR(255) NOT NULL DEFAULT UUID(),
          email VARCHAR(255) NOT NULL UNIQUE CHECK(isEmail(email)),
          username VARCHAR(255) NOT NULL CHECK(LENGTH(username) BETWEEN 3 AND 25),
          fullname VARCHAR(255) CHECK(LENGTH(fullname) BETWEEN 3 AND 50),
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(255),
          address TEXT,
          profileName VARCHAR(255) DEFAULT 'zero.png',
          profileURL VARCHAR(255) DEFAULT 'http://localhost:5000/profiles/zero.png',
          PRIMARY KEY (uuid)
        );
      `);

      console.log('Users table is created or already exists');
    } catch (error) {
      console.error('Error creating users table:', error);
    }
  }
};

userDb.define();

module.exports = userDb;
