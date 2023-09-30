const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Подключен уже к монго епт');
  })
  .catch((err) => {
    console.error('Нихуя не подключен к моногдб:', err);
  });

app.listen(PORT, () => {
  console.log(`Йоу чо каво! Запущен на ${PORT}`);
});
