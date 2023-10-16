const { celebrate, Joi } = require('celebrate');

const urlRegex = /https?:\/\/(www\.)?[\w-]+(\.\w+)+([/\w-._~:?#[\]@!$&'()*+,;=]+)?#?/;

const createUserSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().regex(urlRegex).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
  }),
});

module.exports = {
  createUserSchema,
  loginSchema,
};
