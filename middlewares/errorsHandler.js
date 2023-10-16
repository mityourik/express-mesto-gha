// eslint-disable-next-line consistent-return
const handleValidationErrors = (err, req, res, next) => {
  console.log('Мидлвара пошла:', err);

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Пользователь с таким email уже зарегистрирован',
    });
  }

  if (err.status === 401) {
    return res.status(401).json({
      message: 'Аутентификация не удалась',
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Неверный формат идентификатора' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Веедены некорректные данные' });
  }

  next(err);
};

module.exports = { handleValidationErrors };
