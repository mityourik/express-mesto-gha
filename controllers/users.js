require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key';
const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/httpStatuses');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

// ф-я подключения всех пользователей
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(HTTP_STATUS_OK).json(users);
  } catch (error) {
    const internalError = new InternalServerError('Ошибка на сервере');
    return next(internalError);
  }
};

// ф-я получения пользователя по id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const notFoundError = new NotFoundError('Пользователь по указанному _id не найден');
      return next(notFoundError);
    }
    return res.status(HTTP_STATUS_OK).json(user);
  } catch (error) {
    return next(error);
  }
};

// ф-я создания нового пользователя
const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const conflictError = new ConflictError('Пользователь с таким email уже существует.');
      return next(conflictError);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(HTTP_STATUS_CREATED).json({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (error) {
    return next(error);
  }
};

// Функция для унификации метода findByIdAnUpdate
const updateUser = async (req, res, next, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      const notFoundError = new NotFoundError('Пользователь с указанным _id не найден.');
      return next(notFoundError);
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return next(error);
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
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !await bcrypt.compare(password, user.password)) {
      const unauthorizedError = new UnauthorizedError('Неверный логин или пароль');
      return next(unauthorizedError);
    }

    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });

    return res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: true,
      maxAge: 3600000 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    }).status(HTTP_STATUS_OK).json({ message: 'Вы успешно авторизировались!' });
  } catch (error) {
    return next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const notFoundError = new NotFoundError('Пользователь не найден');
      return next(notFoundError);
    }

    const userData = user.toObject();
    delete userData.password;

    return res.status(HTTP_STATUS_OK).json(userData);
  } catch (error) {
    return next(error);
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
