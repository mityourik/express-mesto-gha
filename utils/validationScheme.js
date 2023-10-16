const Joi = require('@hapi/joi');

const urlRegex = /https?:\/\/(www\.)?[\w-]+(\.\w+)+([/\w-._~:?#[\]@!$&'()*+,;=]+)?#?/;

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  about: Joi.string().min(3).max(30).required(),
  avatar: Joi.string().regex(urlRegex).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
});

module.exports = {
  createUserSchema,
  loginSchema,
};
