const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// ф-я подключения всех пользователей
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// ф-я получения пользователя по id
// eslint-disable-next-line consistent-return
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next({ status: 404, message: 'Пользователь по указанному _id не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ф-я создания нового пользователя
// eslint-disable-next-line consistent-return
const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ name: user.name, email: user.email });
  } catch (error) {
    next(error);
  }
};

// Функция для унификации метода findByIdAnUpdate
// eslint-disable-next-line consistent-return
const updateUser = async (req, res, next, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return next({ status: 404, message: 'Пользователь с указанным _id не найден.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Функция для обновления профиля
const updateUserProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const updateData = { name, about };
  updateUser(req, res, next, updateData);
};

// Функция для обновления аватара
const updateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const updateData = { avatar };
  updateUser(req, res, next, updateData);
};

// Ф-я для логина
// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await bcrypt.compare(password, user.password)) {
      return next({ status: 401, message: 'Неверный логин или пароль' });
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 3600000 * 24 * 7,
    }).status(200).json({ message: 'Вы успешно авторизировались!' });
  } catch (error) {
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next({ status: 404, message: 'Пользователь не найден' });
    }
    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getUserInfo,
};
