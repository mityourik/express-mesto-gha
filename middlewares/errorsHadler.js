const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
} = require('../utils/httpStatuses');

// eslint-disable-next-line no-unused-vars
const errorsHandler = (err, req, res, next) => {
  let { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  if (err.status) {
    statusCode = err.status;
    message = 'Неверный логин или пароль';
  } else if (err.name === 'CastError') {
    statusCode = HTTP_STATUS_BAD_REQUEST;
    message = 'Неверный формат идентификатора';
  } else if (err.code === 11000) {
    statusCode = HTTP_STATUS_CONFLICT;
    message = 'Такой email уже зарегистрирован';
  }

  res.status(statusCode).json({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка на сервере' : message,
  });
};

module.exports = { errorsHandler };
