const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes');
const { errorsHandler } = require('./middlewares/errorsHadler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'https://mityourik.nomoredomainsrocks.ru', 'https://api.mityourik.nomoredomainsrocks.ru'], credentials: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`На порте: ${PORT}`);
});
