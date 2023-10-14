const { celebrate, Joi } = require('celebrate');

const urlRegex = /https?:\/\/(www\.)?[\w-]+(\.\w+)+([/\w-._~:?#[\]@!$&'()*+,;=]+)?#?/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().pattern(/^[а-яА-ЯёЁa-zA-Z0-9]{3,30}$/).min(3).max(30)
      .required(),
    about: Joi.string().pattern(/^[а-яА-ЯёЁa-zA-Z0-9]{3,30}$/).min(3).max(30)
      .required(),
    avatar: Joi.string().pattern(urlRegex).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).required(),
  }),
});

module.exports = {
  validateCreateUser,
};
