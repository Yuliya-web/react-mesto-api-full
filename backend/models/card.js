const mongoose = require('mongoose');

const urlValidation = new RegExp('^(https?:\\/\\/)?(www\\.)?'
    + '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' // домен
    + '(\\/[a-z0-9#$:!@[]();&%_.~+=-?]*)*', 'i'); // путь

// Опишем схему:
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlValidation.test(v);
      },
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
