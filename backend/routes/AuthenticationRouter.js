const express = require('express');
const {
  Register,
  Login,
  getMe,
  Logout,
} = require('../controllers/Authentication.js');

const AuthenticationRouter = express.Router();

AuthenticationRouter.post('/register', Register);
AuthenticationRouter.post('/login', Login);
AuthenticationRouter.get('/getme', getMe);
AuthenticationRouter.delete('/logout', Logout);

module.exports = AuthenticationRouter;
