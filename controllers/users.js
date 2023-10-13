const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // хеширование пароля

    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    } if (error.code === 11000) {
      res.status(409).json({ message: 'Пользователь с таким email уже зарегистрирован' });
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

// Ф-я для логина
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error();
    }

    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 3600000 * 24 * 7,
    }).status(200).send({ message: 'Вы успешно авторизировались!' });
  } catch (error) {
    res.status(401).json({ message: 'Неверный логин или пароль' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'Пользователь найден' });
      return;
    }
    res.send({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
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
