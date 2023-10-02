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

// Функция для унификации метода findByIdAnUpdate
// eslint-disable-next-line consistent-return
const updateUser = async (req, res, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь с указанным _id не найден.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Переданы некорректные данные в поле.' });
    }
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

// Функция для обновления профиля
const updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  const updateData = { name, about };
  updateUser(req, res, updateData);
};

// Функция для обновления аватара
const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  const updateData = { avatar };
  updateUser(req, res, updateData);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
