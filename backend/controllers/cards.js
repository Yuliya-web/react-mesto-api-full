const Card = require('../models/card');
// const RequestError = require('../errors/RequestError');
// const AbsError = require('../errors/AbsError');

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
module.exports.deleteCard = (req, res) => {
  Card.findById(req.params._id)
    .orFail(new Error('AbsError'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Error('ForbiddenError');
      }
      card.remove()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.message === 'AbsError') {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.message === 'ForbiddenError') {
        return res.status(403).send({ message: 'Нет прав на удаление' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
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
        return res.status(404).send({ message: 'Карточка с таким id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (!err.messageFormat) {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' });
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
