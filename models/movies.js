// Model 
const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genres');

const movieSchema = new mongoose.Schema({
	title: {type: String, required: true, minlength: 2},
	genre: {type: genreSchema, required: true},
	numberInStock: {type: Number, min: 0, max: 255, required: true},
	dailyRentalRate: {type: Number, min: 0, max: 255, default: 3}
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {

  const schema = {
    title: Joi.string().min(2).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
  };

  return Joi.validate(movie, schema);
}

module.exports.validateMovie = validateMovie;
module.exports.Movie = Movie;