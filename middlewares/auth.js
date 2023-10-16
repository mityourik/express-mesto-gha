require('dotenv').config();

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error('Токен не получен епт');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    next({
      status: 401,
      message: error.message || 'Необходима авторизация',
    });
  }
};

module.exports = auth;
