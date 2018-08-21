const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
	genre: {type: String, required: true}
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(3).required()
  };
  return Joi.validate(genre, schema);
}

module.exports.validateGenre = validateGenre;
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;