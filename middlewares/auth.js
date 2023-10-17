require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key';
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.jwt;
    if (!token) {
      const unauthorizedError = new UnauthorizedError('Токен не получен');
      return next(unauthorizedError);
    }

    const payload = jwt.verify(token, jwtSecret);

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }

  return undefined;
};

module.exports = auth;
