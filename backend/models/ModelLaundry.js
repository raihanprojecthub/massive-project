const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');
const userDb = require('./ModelUser.js');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const laundryDb = {
  define: async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS laundry (
          uuid VARCHAR(255) NOT NULL DEFAULT UUID(),
          typeLaundry VARCHAR(255),
          userId INT,
          fullname VARCHAR(255) NOT NULL,
          phone VARCHAR(255),
          address TEXT,
          typeItem VARCHAR(255),
          amountItem INT,
          typeItemPrice INT,
          totalPrice INT,
          ongkir INT,
          note TEXT,
          statusOrder VARCHAR(255),
          PRIMARY KEY (uuid),
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `);

      console.log('Laundry table is created or already exists');
    } catch (error) {
      console.error('Error creating laundry table:', error);
    }
  }
};

userDb.define();
laundryDb.define();

module.exports = laundryDb;
