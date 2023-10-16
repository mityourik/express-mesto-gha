/* eslint-disable indent */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(router);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.joi) {
      const errorMessage = err.joi.details[0].message;
      res.status(400).send({
          status: 'error',
          message: errorMessage || 'Validation failed',
      });
  } else {
      res.status(500).send({
          status: 'error',
          message: 'Internal Server Error',
      });
  }
});

app.listen(PORT, () => {
  console.log(`На порте: ${PORT}`);
});
