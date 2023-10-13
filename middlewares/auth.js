const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error();
    }

    const payload = jwt.verify(token, 'some-secret-key');

    req.user = payload;

    next();
  } catch (error) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
};

module.exports = auth;
