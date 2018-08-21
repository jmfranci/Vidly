const mongoose = require('mongoose');
const Joi = require('joi');


const clientSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 3},
	isGold: {type: Boolean, default: false},
	phoneNumber: {type: Number, required: true}
});

const Client = mongoose.model('Client', clientSchema);

function validateClient(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
    phoneNumber: Joi.number().required()
  };
  return Joi.validate(genre, schema);
}

module.exports.validateClient = validateClient;
module.exports.Client = Client;