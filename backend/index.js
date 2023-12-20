const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
dotenv.config();

const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const AuthenticationRouter = require('./routes/AuthenticationRouter');
const UserRouter = require('./routes/UserRouter');
const LaundryRouter = require('./routes/LaundryRouter');
const ReportRouter = require('./routes/ReportRouter');

const app = express();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const sessionStore = new MySQLStore(dbConfig);

app.use(
  session({
    secret: 'IniPokoknyaRahasiaKita',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
  })
);

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
    ],
  })
);

// static file untuk image
app.use(express.static('assets'));

app.use(express.json());
app.use(AuthenticationRouter);
app.use(UserRouter);
app.use(LaundryRouter);
app.use(ReportRouter);

app.listen(process.env.APP_PORT, () => {
  console.log(`server running... ${process.env.APP_PORT}`);
});
