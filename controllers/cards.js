const mongoose = require('mongoose');
const Card = require('../models/card');

// eslint-disable-next-line consistent-return
const handleCardRequest = async (req, res, requestFunc, errorMessage) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Неверный идентификатор карточки' });
    }

    const result = await requestFunc(cardId);

    if (!result) {
      return res.status(404).json({ message: errorMessage });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

// eslint-disable-next-line consistent-return
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Неверный идентификатор карточки' });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Карточка с указанным _id не найдена.' });
    }

    if (card.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Недостаточно прав для удаления карточки' });
    }

    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: 'Карточка удалена' });
  } catch (error) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
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
