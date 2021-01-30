const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send( card ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка добавления карточки' });
      }
    });
};

// возвращает все карточки
module.exports.getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((card) => res.send( card ))
  .catch((err) => {
    if (err.name === 'CardsError') {
      res.status(400).send({ message: 'Некорректные данные' });
    }
  });

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params._id)
.orFail(new Error('FindIdError'))
.then(() => res.status(200).send({ message: 'Карточка удалена' }))
.catch((err) => manageErrorStatus(res, err, 'карточки'));

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
      return res.send( card );
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
      return res.send( card );
    })
    .catch((err) => {
      if (!err.messageFormat) {
        return res.status(404).send({ message: `Не существует карточки с id ${req.params.cardId}` });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};
