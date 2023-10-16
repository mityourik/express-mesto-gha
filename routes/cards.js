const express = require('express');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  createCardSchema,
  likeCardSchema,
  dislikeCardSchema,
  deleteCardSchema,
} = require('../validationSchemas/joiValidationSchemas');

const router = express.Router();

router.get('/cards', getAllCards);
router.post('/cards', createCardSchema, createCard);
router.delete('/cards/:cardId', deleteCardSchema, deleteCard);
router.put('/cards/:cardId/likes', likeCardSchema, likeCard);
router.delete('/cards/:cardId/likes', dislikeCardSchema, dislikeCard);

module.exports = router;
