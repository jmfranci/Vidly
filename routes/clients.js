const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Client, validateClient} = require('../models/clients');
const {isMongoIdValid} = require('../utils/functions');

router.get('/', async (req,res) => {
	const clients = await Client.find().sort('name');
	res.send(clients);
});

router.get('/:id', async (req, res) => {
	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');

	const client = await Client.findById(req.params.id);

	if (!client) return res.status(404).send('CLient not found');
	
	res.send (client);
});

router.post('/', auth, async (req, res) => {
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



