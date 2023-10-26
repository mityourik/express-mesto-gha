const Card = require('../models/card');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/httpStatuses');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(HTTP_STATUS_OK).json(cards);
  } catch (error) {
    const internalError = new InternalServerError('Ошибка на сервере');
    return next(internalError);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });
    await card.save();
    return res.status(HTTP_STATUS_CREATED).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new BadRequestError('Переданы некорректные данные при создании карточки.');
      return next(validationError);
    }
    const internalError = new InternalServerError('На сервере произошла ошибка');
    return next(internalError);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);

    if (!card) {
      const notFoundError = new NotFoundError('Карточка с указанным _id не найдена.');
      return next(notFoundError);
    }

    if (card.owner.toString() !== req.user._id) {
      const forbiddenError = new ForbiddenError('Недостаточно прав для удаления карточки');
      return next(forbiddenError);
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(HTTP_STATUS_OK).json(card);
  } catch (error) {
    const internalError = new InternalServerError('На сервере произошла ошибка');
    return next(internalError);
  }
};

const updateLike = async (req, res, next, method) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { [method]: { likes: req.user._id } },
      { new: true },
    ).orFail(new NotFoundError('Нет карточки по данному id'));

    res.send(card);
  } catch (error) {
    next(error);
  }
};

const likeCard = (req, res, next) => updateLike(req, res, next, '$addToSet');
const dislikeCard = (req, res, next) => updateLike(req, res, next, '$pull');

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
