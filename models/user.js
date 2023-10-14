const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто', // Станд значение для инпута
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь океана', // Станд значение для инпута
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value), // Проверка URL с помощью validator
      message: 'Неверный формат URL', // Сообщение об ошибке, если URL невалидный
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
    select: false, // необходимо добавить поле select
  },
}, {
  versionKey: false, // убрал создание поля ключа версии записи в монго
});

module.exports = mongoose.model('user', userSchema);
