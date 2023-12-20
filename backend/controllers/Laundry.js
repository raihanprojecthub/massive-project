const mysql = require('mysql2/promise');
const { promisify } = require('util');
const dbConfig = require('../database/ConfigDB');

const pool = mysql.createPool(dbConfig);
const query = promisify(pool.query).bind(pool);

const createLaundry = async (req, res) => {
  const {
    typeLaundry,
    fullname,
    phone,
    address,
    typeItem,
    amountItem,
    typeItemPrice,
    note,
    ongkir,
  } = req.body;

  try {
    const totalPrice =
      parseInt(amountItem) * parseInt(typeItemPrice) + parseInt(ongkir);

    await query(
      'INSERT INTO laundry (fullname, phone, address, typeItem, amountItem, note, userId, statusOrder, totalPrice, typeLaundry, typeItemPrice, ongkir) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [fullname, phone, address, typeItem, amountItem, note, req.userId, 'Sedang Diproses', totalPrice, typeLaundry, typeItemPrice, ongkir]
    );

    res.status(200).json({ msg: 'berhasil melakukan input data' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getLaundryByWeight = async (req, res) => {
  try {
    const findLaundry = await query('SELECT * FROM laundry WHERE typeLaundry = ?', ['weight']);

    res.status(200).json(findLaundry);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getLaundryByPiece = async (req, res) => {
  try {
    const findLaundry = await query('SELECT * FROM laundry WHERE typeLaundry = ?', ['piece']);

    res.status(200).json(findLaundry);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getLaundryUserByWeight = async (req, res) => {
  try {
    const findLaundry = await query('SELECT * FROM laundry WHERE typeLaundry = ? AND userId = ?', ['weight', req.userId]);

    res.status(200).json(findLaundry);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getLaundryUserByPiece = async (req, res) => {
  try {
    const findLaundry = await query('SELECT * FROM laundry WHERE typeLaundry = ? AND userId = ?', ['piece', req.userId]);

    res.status(200).json(findLaundry);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getLaundryByUUID = async (req, res) => {
  try {
    const findLaundry = await query('SELECT * FROM laundry WHERE uuid = ?', [req.params.uuid]);

    res.status(200).json(findLaundry);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteLaundry = async (req, res) => {
  try {
    await query('DELETE FROM laundry WHERE uuid = ?', [req.params.uuid]);

    res.status(200).json({ msg: 'data laundry berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const editLaundry = async (req, res) => {
  const {
    typeLaundry,
    fullname,
    phone,
    address,
    typeItem,
    amountItem,
    typeItemPrice,
    note,
    statusOrder,
    ongkir,
  } = req.body;

  try {
    const [findLaundry] = await query('SELECT * FROM laundry WHERE uuid = ?', [req.params.uuid]);

    const totalPrice =
      parseInt(amountItem) * parseInt(typeItemPrice) + parseInt(ongkir);

    const editData = {
      fullname: fullname || findLaundry.fullname,
      phone: phone || findLaundry.phone,
      address: address || findLaundry.address,
      typeItem: typeItem || findLaundry.typeItem,
      amountItem: amountItem || findLaundry.amountItem,
      note: note || findLaundry.note,

      typeLaundry: typeLaundry || findLaundry.typeLaundry,
      typeItemPrice: typeItemPrice || findLaundry.typeItemPrice,
      statusOrder: statusOrder || findLaundry.statusOrder,

      totalPrice: totalPrice || findLaundry.totalPrice,
      ongkir: ongkir || findLaundry.ongkir,
    };

    await query('UPDATE laundry SET fullname = ?, phone = ?, address = ?, typeItem = ?, amountItem = ?, note = ?, typeLaundry = ?, typeItemPrice = ?, statusOrder = ?, totalPrice = ?, ongkir = ? WHERE uuid = ?',
      [editData.fullname, editData.phone, editData.address, editData.typeItem, editData.amountItem, editData.note, editData.typeLaundry, editData.typeItemPrice, editData.statusOrder, editData.totalPrice, editData.ongkir, req.params.uuid]);

    res.status(200).json({ msg: 'berhasil melakukan update data' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createLaundry,
  getLaundryByPiece,
  getLaundryByWeight,
  getLaundryUserByPiece,
  getLaundryUserByWeight,
  getLaundryByUUID,
  deleteLaundry,
  editLaundry,
};
