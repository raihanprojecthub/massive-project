const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const createReport = async (req, res) => {
  try {
    await query('INSERT INTO reports (userId, reportMessage, email, fullname) VALUES (?, ?, ?, ?)',
      [req.userId, req.body.reportMessage, req.body.email, req.body.fullname]);

    res.status(200).json({ msg: 'berhasil menambah laporan' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    await query('DELETE FROM reports WHERE uuid = ?', [req.params.uuid]);

    res.status(200).json({ msg: 'berhasil menghapus laporan' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const response = await query('SELECT * FROM reports');

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { createReport, deleteReport, getReports };
