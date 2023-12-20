const argon2 = require('argon2');
const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const Register = async (req, res) => {
  const { username, fullname, email, password, confPassword, phone } = req.body;

  if (password !== confPassword) {
    return res.status(400).json({ msg: 'password yang anda tidak sama' });
  }

  try {
    const [existingUser] = await query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return res.status(400).json({ msg: 'email sudah digunakan' });
    }

    const hashPassword = await argon2.hash(password);
    await query('INSERT INTO users (username, email, password, phone, fullname) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashPassword, phone, fullname]);

    res.status(201).json({ msg: 'registrasi berhasil' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const [user] = await query('SELECT * FROM users WHERE email = ?', [req.body.email]);

    if (!user) {
      return res.status(404).json({ msg: 'user tidak ditemukan' });
    }

    const matchPassword = await argon2.verify(user.password, req.body.password);

    if (!matchPassword) {
      return res.status(400).json({ msg: 'maaf, password salah' });
    }

    req.session.temporarySessionUUID = user.uuid;

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getMe = async (req, res) => {
  if (!req.session.temporarySessionUUID) {
    return res.status(401).json({ msg: 'harap login dulu...' });
  }

  try {
    const [user] = await query('SELECT * FROM users WHERE uuid = ?', [req.session.temporarySessionUUID]);

    if (!user) {
      return res.status(404).json({ msg: 'maaf, user tidak ditemukan' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const Logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(400).json({ msg: 'logout error' });
    }
    res.status(200).json({ msg: 'logout berhasil...' });
  });
};

module.exports = {
  Register,
  Login,
  getMe,
  Logout,
};
