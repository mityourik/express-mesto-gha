const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const celebrateErrorHandler = require('./middlewares/celebrateErrorHadler');
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

app.use(celebrateErrorHandler);

app.use(errors());

app.listen(PORT, () => {
  console.log(`На порте: ${PORT}`);
});
