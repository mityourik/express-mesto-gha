const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const notFoundRouter = require('./routes/notFoundPages');
const config = require('./config');

const app = express();

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '65184ba742b9fa5807fe9421',
  };

  next();
});

app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);
app.use(notFoundRouter);

app.listen(config.PORT, () => {
  console.log(`чо каво! Запущен на ${config.PORT}`);
});
