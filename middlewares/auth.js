require('dotenv').config();

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.jwt;
    if (!token) {
      throw new Error('Токен не получен епт');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({
      message: error.message || 'Необходима авторизация',
    });
  }
};

module.exports = auth;
