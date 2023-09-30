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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
