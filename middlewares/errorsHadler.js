const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
  next();
};

module.exports = { errorsHandler };
