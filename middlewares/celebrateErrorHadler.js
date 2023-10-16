const celebrate = require('celebrate');

module.exports = (err, req, res, next) => {
  if (err instanceof celebrate.CelebrateError) {
    res.status(400).json({
      message: err.details.get('body').details[0].message,
    });
  } else {
    next(err);
  }
};
