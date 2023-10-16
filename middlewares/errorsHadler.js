const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const errorsHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err.status) {
    statusCode = err.status;
    message = 'Неверный логин или пароль';
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Неверный формат идентификатора';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Такой email уже зарегистрирован';
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
};

module.exports = { errorsHandler };
