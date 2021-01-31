const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, updateUser, updateAvatar, getUserInfo, getUser,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/', getUsers);

userRoutes.get('/me', getUserInfo);

userRoutes.get('/:_id', celebrate({
  headers: Joi.object().keys({}).unknown(true),
}), getUser);

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
  }),
}), updateAvatar);

module.exports = userRoutes;
