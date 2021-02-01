require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const auth = require('./middlewares/auth');
const cardsRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const AbsError = require('./errors/AbsError');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30).min(2),
    about: Joi.string().max(30).min(2),
    avatar: Joi.string().pattern(/^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardsRoutes);
app.use('/*', () => {
  throw new AbsError('Страница не найдена');
});
app.use(errors());
app.use(errorLogger);
app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту ${PORT}`);
});
