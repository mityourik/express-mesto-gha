const Card = require('../models/card');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: 'ошибка при получении карточек' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link });
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ error: 'Ошибка при создании карточки' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      res.status(404).json({ error: 'карточка не найдена' });
      return;
    }
    await card.remove();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ error: 'ошибка при удалении карточки' });
  }
};

// eslint-disable-next-line consistent-return
const likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при постановке лайка' });
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
      return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: 'ошибка при удалении лайка' });
  }
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
