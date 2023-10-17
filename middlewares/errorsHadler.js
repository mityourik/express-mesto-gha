const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_UNAUTHORIZED,
} = require('../utils/httpStatuses');

// eslint-disable-next-line no-unused-vars
const errorsHandler = (err, req, res, next) => {
  let { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS_BAD_REQUEST;
    message = 'Неверный идентификатор';
  } else if (err.code === 11000) {
    statusCode = HTTP_STATUS_CONFLICT;
    message = 'Такой email уже зарегистрирован';
  } else if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS_BAD_REQUEST;
    message = 'Ошибка валидации';
  } else if (err.status) {
    statusCode = err.status;
    if (statusCode === HTTP_STATUS_NOT_FOUND) {
      message = 'Пользователь не найден!';
    } else if (statusCode === HTTP_STATUS_BAD_REQUEST) {
      message = 'Неверный логин или пароль';
    } else if (statusCode === HTTP_STATUS_UNAUTHORIZED) {
      message = 'Необходима авторизация';
    }
  }

  res.status(statusCode).json({
    message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка на сервере' : message,
  });
};

module.exports = { errorsHandler };
