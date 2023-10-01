const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value), // Проверка URL с помощью validator
      message: 'Неверный формат URL', // Сообщение об ошибке, если URL невалидный
    },
  },
}, {
  versionKey: false, // убрал создание поля ключа версии записи в монго
});

module.exports = mongoose.model('user', userSchema);
