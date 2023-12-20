const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const VerifyUser = async (req, res, next) => {
  if (!req.session.temporarySessionUUID) {
    return res.status(401).json({ msg: 'mohon login terlebih dahulu' });
  }

  try {
    const [findUser] = await query('SELECT * FROM users WHERE uuid = ?', [req.session.temporarySessionUUID]);

    if (!findUser) {
      return res.status(404).json({ msg: 'user tidak ditemukan' });
    }

    req.userId = findUser.id;
    req.role = findUser.role;

    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = VerifyUser;
