// Model 
const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
	client: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    })
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturnted: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {

  const schema = {
    clientId: Joi.string().required(),
    movieId: Joi.string().required()
  };

  return Joi.validate(rental, schema);
}

module.exports.validateRental = validateRental;
module.exports.Rental = Rental;