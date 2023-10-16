const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const { handleValidationErrors } = require('./middlewares/errorsHandler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.use(handleValidationErrors);

app.listen(PORT, () => {
  console.log(`На порте: ${PORT}`);
});
