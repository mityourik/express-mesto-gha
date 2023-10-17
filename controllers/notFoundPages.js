const NotFoundError = require('../errors/NotFoundError');

const handleNotFound = (req, res, next) => {
  const notFoundError = new NotFoundError('Запрашиваемая страница не найдена.');
  return next(notFoundError);
};

module.exports = handleNotFound;
