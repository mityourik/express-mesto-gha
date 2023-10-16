// eslint-disable-next-line consistent-return
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: 'Введены неверные данные' });
  }
  next();
};

module.exports = validate;
