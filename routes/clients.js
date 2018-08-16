const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();

const clientSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 3},
	isGold: {type: Boolean, default: false},
	phoneNumber: {type: Number, required: true}
});

const Client = mongoose.model('Client', clientSchema);

function isMongoIdValid(id){
	if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
	else return false;
}

function validateClient(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
    isGold: Joi.boolean(),
    phoneNumber: Joi.number().required()
  };
  return Joi.validate(genre, schema);
}

router.get('/', async (req,res) => {
	const clients = await Client.find().sort('name');
	res.send(clients);
});

router.get('/:id', async (req, res) => {
	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');

	const client = await Client.findById(req.params.id);

	if (!client) return res.status(404).send('Genre not found');
	
	res.send (client);
});

router.post('/', async (req, res) => {
	const { error } = validateClient(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		let client = new Client(req.body);
		client = await client.save();
		res.send(client);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

 router.put('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const { error } = validateClient(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		const client = await Client.findByIdAndUpdate(req.params.id, req.body, {new: true});
		if (!client) return res.status(404).send('Client not found');
		res.send(client);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

router.delete('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const client = await Client.findByIdAndRemove(req.params.id);

	if (!client) return res.status(404).send('Genre not found');

	res.send (client);
});

module.exports = router;



