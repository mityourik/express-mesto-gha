const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/httpStatuses');

// eslint-disable-next-line consistent-return
const handleCardRequest = async (req, res, next, requestFunc, errorMessage) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      const error = new Error('Неверный идентификатор карточки');
      error.status = HTTP_STATUS_BAD_REQUEST;
      return next(error);
    }

    const result = await requestFunc(cardId);

    if (!result) {
      const error = new Error(errorMessage);
      error.status = HTTP_STATUS_NOT_FOUND;
      return next(error);
    }

    res.status(HTTP_STATUS_OK).json(result);
  } catch (error) {
    error.status = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(error);
  }
};

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(HTTP_STATUS_OK).json(cards);
  } catch (error) {
    error.status = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    next(error);
  }
};

// eslint-disable-next-line consistent-return
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });
    await card.save();
    res.status(HTTP_STATUS_CREATED).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new Error('Переданы некорректные данные при создании карточки.');
      validationError.status = HTTP_STATUS_BAD_REQUEST;
      return next(validationError);
    }
    const internalError = new Error('На сервере произошла ошибка');
    internalError.status = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    return next(internalError);
  }
};

// eslint-disable-next-line consistent-return
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      const badRequestError = new Error('Неверный идентификатор карточки');
      badRequestError.status = HTTP_STATUS_BAD_REQUEST;
      return next(badRequestError);
    }

    const card = await Card.findById(cardId);

    if (!card) {
      const notFoundError = new Error('Карточка с указанным _id не найдена.');
      notFoundError.status = HTTP_STATUS_NOT_FOUND;
      return next(notFoundError);
    }

    if (card.owner.toString() !== req.user._id) {
      const forbiddenError = new Error('Недостаточно прав для удаления карточки');
      forbiddenError.status = HTTP_STATUS_FORBIDDEN;
      return next(forbiddenError);
    }

    await Card.findByIdAndDelete(cardId);
    res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (error) {
    const internalError = new Error('На сервере произошла ошибка');
    internalError.status = HTTP_STATUS_INTERNAL_SERVER_ERROR;
    return next(internalError);
  }
};

const likeCard = async (req, res) => {
  const requestFunc = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  );
  const errorMessage = 'Передан несуществующий _id карточки.';
  handleCardRequest(req, res, requestFunc, errorMessage);
};

const dislikeCard = async (req, res) => {
  const requestFunc = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  );
  const errorMessage = 'Передан несуществующий _id карточки.';
  handleCardRequest(req, res, requestFunc, errorMessage);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
