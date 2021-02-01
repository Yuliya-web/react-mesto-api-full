const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserError = require('../errors/UserError');
const AbsError = require('../errors/AbsError');
const RequestError = require('../errors/RequestError');

// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// возвращает пользователя по _id
const getUser = (req, res, next) => {
  User.findById(req.params._id === 'me' ? req.user : req.params._id)
    .orFail(new AbsError('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new RequestError('Не передан корректный id');
      }
      throw err;
    })
    .catch(next);
};

// возвращает информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new AbsError('Такой пользователь отсутствует в базе'))
    .then((userData) => res.status(200).send(userData))
    .catch(next);
};

// создает пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new RequestError('Пользователь с таким email существует в базе');
      }
      return bcrypt.hash(password, 8)
        .then((hash) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((data) => res.status(200).send({ email: data.email }))
        .catch(next);
    })
    .catch(next);
};

// получение и проверка почты и пароля
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        return next(new UserError('Такого пользователя не существует'));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new UserError('Неправильный логин или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch(next);
};

// обновляет профиль
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new Error('AbsError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'AbsError') {
        res.status(404).send({ message: 'Такой пользователь отсутствует в базе' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};

// обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('AbsError'))
    .then((ava) => res.send(ava))
    .catch((err) => {
      if (err.message === 'AbsError') {
        res.status(404).send({ message: 'Такой пользователь отсутствует в базе' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserInfo,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
