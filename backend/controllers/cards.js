const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const RequestError = require('../errors/RequestError');
const AbsError = require('../errors/AbsError');

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка добавления карточки' });
      }
    });
};

// возвращает все карточки
module.exports.getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CardsError') {
      res.status(400).send({ message: 'Некорректные данные' });
    }
  });

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  return Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        throw new AbsError('Неверный id карточки');
      }
      if (JSON.stringify(owner) !== JSON.stringify(card.owner)) {
        throw new ForbiddenError('Нет прав для удаления');
      }
      return Card.remove({ _id: card._id })
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new RequestError('Некорректный id');
      }
      throw err;
    })
    .catch(next);
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: `Не существует карточки с id ${req.params.cardId}` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (!err.messageFormat) {
        return res.status(404).send({ message: `Не существует карточки с id ${req.params.cardId}` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: `Не существует карточки с id ${req.params.cardId}` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (!err.messageFormat) {
        return res.status(404).send({ message: `Не существует карточки с id ${req.params.cardId}` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};
