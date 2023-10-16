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
const handleCardRequest = async (req, res, requestFunc, errorMessage) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Неверный идентификатор карточки' });
    }

    const result = await requestFunc(cardId);

    if (!result) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: errorMessage });
    }

    res.status(HTTP_STATUS_OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
  }
};

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(HTTP_STATUS_OK).json(cards);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });
    await card.save();
    res.status(HTTP_STATUS_CREATED).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

// eslint-disable-next-line consistent-return
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Неверный идентификатор карточки' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена.' });
    }

    if (card.owner.toString() !== req.user._id) {
      return res.status(HTTP_STATUS_FORBIDDEN).json({ message: 'Недостаточно прав для удаления карточки' });
    }

    await Card.findByIdAndDelete(cardId);
    res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'На сервере произошла ошибка' });
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
