const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const router = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// app.use(express.json());
// app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`чо каво! Запущен на ${PORT}`);
});
