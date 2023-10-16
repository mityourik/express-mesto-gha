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

const getUserByIdSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const updateUserProfileSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const updateUserAvatarSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex).required(),
  }),
});

module.exports = {
  createUserSchema,
  loginSchema,
  getUserByIdSchema,
  updateUserProfileSchema,
  updateUserAvatarSchema,
};
