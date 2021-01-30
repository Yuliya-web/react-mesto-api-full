const cardsRoutes = require('express').Router();
const {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.post('/', createCard);
cardsRoutes.get('/', getCards);
cardsRoutes.delete('/:_id', deleteCard);
cardsRoutes.put('/:_id/likes', likeCard);
cardsRoutes.delete('/:_id/likes', dislikeCard);

module.exports = cardsRoutes;
