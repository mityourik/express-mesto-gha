// eslint-disable-next-line consistent-return
const handleValidationErrors = (err, req, res, next) => {
  console.log('Мидлвара пошла:', err);

  if (err.details) {
    return res.status(400).json({
      message: 'Введены неверные данные',
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Пользователь с таким email уже зарегистрирован',
    });
  }

  if (err.status === 401) {
    return res.status(401).json({
      message: err.message || 'Аутентификация не удалась',
    });
  }

  next(err);
};

module.exports = { handleValidationErrors };
