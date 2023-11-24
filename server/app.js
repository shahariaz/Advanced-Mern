const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require;

//Import
const GlobalErrorHandler = require('./src/middleware/error');
const AppError = require('./src/utils/AppError');
//Routes Import
const testRoutes = require('./src/routes/test');
const adminRoutes = require('./src/routes/admin');
const loginRoutes = require('./src/routes/login');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
// app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// config
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({
    path: 'config/.env',
  });
}
if (process.env.NODE_ENV === 'PRODUCTION') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('/', (req, res) => {
  res.status(200).send('Hello, World!');
});
// //user routes
// app.use("/api/v1/admins", adminRoutes);
// app.use("/api/v1", loginRoutes);
// app.use("/api/v1", testRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
//Error handlers
app.use(GlobalErrorHandler);
module.exports = app;
