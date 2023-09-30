const User = require('../models/user');

// ф-я подключения всех пользователей
const getAllUsers = async (res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'сорян пользователи не найдены' });
  }
};

// ф-я получения пользователя по id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ error: 'нет такого пользователя лол' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'ошибка при получении пользователя' });
  }
};

// ф-я создания нового пользователя
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при создании пользователя' });
  }
};

// eslint-disable-next-line consistent-return
const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    );

    if (!updateUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};

// eslint-disable-next-line consistent-return
const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении аватара' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
