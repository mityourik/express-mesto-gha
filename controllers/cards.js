const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка по умолчанию.' });
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
      // Ошибка валидации
      res.status(400).json({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      // Все другие ошибки
      res.status(500).json({ message: 'Ошибка на сервере при создании карточки.' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(404).json({ message: 'Карточка с указанным _id не найдена.' });
      return;
    }
    await card.remove();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка на сервере при удалении карточки.' });
  }
};

// eslint-disable-next-line consistent-return
const likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Передан несуществующий _id карточки.' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка по умолчанию.' }); // по умолчанию??
  }
};

// eslint-disable-next-line consistent-return
const dislikeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Передан несуществующий _id карточки.' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
