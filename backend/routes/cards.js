const cardsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
  }),
  headers: Joi.object().keys({}).unknown(true),
}), createCard);

cardsRoutes.get('/', getCards);

cardsRoutes.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
  headers: Joi.object().keys({}).unknown(true),
}), deleteCard);

cardsRoutes.put('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
  headers: Joi.object().keys({}).unknown(true),
}), likeCard);

cardsRoutes.delete('/:_id/likes', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
  headers: Joi.object().keys({}).unknown(true),
}), dislikeCard);

module.exports = cardsRoutes;
