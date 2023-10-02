const User = require('../models/user');

// ф-я подключения всех пользователей
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

// ф-я получения пользователя по id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'Пользователь по указанному _id не найден' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      // eslint-disable-next-line consistent-return
      return res.status(400).json({ message: 'Пользователь по указанному _id не найден' });
    }
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

// ф-я создания нового пользователя
// eslint-disable-next-line consistent-return
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    }
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

// eslint-disable-next-line consistent-return
const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }, // включение опции валидации из модели
    );

    if (!updateUser) {
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден.' });
    }

    res.status(200).json(updateUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные при обновлении профиля.' });
    }
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

// eslint-disable-next-line consistent-return
const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }, // включение валидации поля урла для отлова 400
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные при обновлении аватара.' });
    }
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
