const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто', // Станд значение для инпута
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь', // Станд значение для инпута
  },
  avatar: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Неверный формат URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png', // станд аватар
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Неверный формат email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false, // убрал создание поля ключа версии записи в монго
});

module.exports = mongoose.model('user', userSchema);
