const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');
const userDb = require('./ModelUser');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const reportDb = {
  define: async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS reports (
          uuid VARCHAR(255) NOT NULL DEFAULT UUID(),
          userId INT,
          reportMessage TEXT,
          email VARCHAR(255),
          fullname VARCHAR(255) CHECK(LENGTH(fullname) BETWEEN 3 AND 50),
          PRIMARY KEY (uuid),
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `);

      console.log('Reports table is created or already exists');
    } catch (error) {
      console.error('Error creating reports table:', error);
    }
  }
};

userDb.define();
reportDb.define();

module.exports = reportDb;
