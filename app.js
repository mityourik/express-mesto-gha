const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('подключено к монгоДБ'))
  .catch((err) => console.error('Ошибка при подключении к монгоДБ', err));

app.use((req, res, next) => {
  req.user = {
    _id: '65184ba742b9fa5807fe9421',
  };

  next();
});

app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);

app.listen(PORT, () => {
  console.log(`чо каво! Запущен на ${PORT}`);
});
