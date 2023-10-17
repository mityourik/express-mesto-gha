const Card = require('../models/card');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/httpStatuses');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const handleCardRequest = async (req, res, next, requestFunc, errorMessage) => {
  try {
    const { cardId } = req.params;
    const result = await requestFunc(cardId);

    if (!cardId) {
      const badRequestError = new BadRequestError(errorMessage);
      return next(badRequestError);
    }

    if (!result) {
      const notFoundError = new NotFoundError(errorMessage);
      return next(notFoundError);
    }

    res.status(HTTP_STATUS_OK).json(result); // tut
  } catch (error) {
    const internalError = new InternalServerError(errorMessage);
    next(internalError);
  }

  return undefined;
};

const getAllCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(HTTP_STATUS_OK).json(cards); // tut
  } catch (error) {
    const internalError = new InternalServerError('Ошибка на сервере');
    next(internalError);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link, owner: req.user._id });
    await card.save();
    res.status(HTTP_STATUS_CREATED).json(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationError = new BadRequestError('Переданы некорректные данные при создании карточки.');
      return next(validationError);
    }
    const internalError = new InternalServerError('На сервере произошла ошибка');
    return next(internalError);
  }

  return undefined;
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!cardId) {
      const badRequestError = new BadRequestError('Неверный идентификатор карточки');
      return next(badRequestError);
    }

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
    res.status(HTTP_STATUS_OK).json({ message: 'Карточка удалена' });
  } catch (error) {
    const internalError = new InternalServerError('На сервере произошла ошибка');
    return next(internalError);
  }

  return undefined;
};

const likeCard = async (req, res, next) => {
  const requestFunc = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  );
  const errorMessage = 'Передан несуществующий _id карточки.';
  handleCardRequest(req, res, next, requestFunc, errorMessage);
};

const dislikeCard = async (req, res, next) => {
  const requestFunc = (cardId) => Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  );
  const errorMessage = 'Передан несуществующий _id карточки.';
  handleCardRequest(req, res, next, requestFunc, errorMessage);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
