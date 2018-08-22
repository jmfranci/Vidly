const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {isMongoIdValid} = require('../utils/functions');
const {Genre, validateGenre} = require('../models/genres');

router.get('/', async (req,res) => {
	const genres = await Genre.find().sort('genre');
	res.send(genres);
});

router.get('/:id', async (req, res) => {
	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');

	const genre = await Genre.findById(req.params.id);
	if (!genre) return res.status(404).send('Genre not found');
	res.send (genre);
});

router.post('/', auth, async (req, res) => {
	const { error } = validateGenre(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);

	let genre = new Genre(req.body);
	genre = await genre.save();
	res.send(genre);
	
});


 router.put('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');

	const { error } = validateGenre(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {new: true});
	if (!genre) return res.status(404).send('Genre not found');
	res.send(genre);
});

 router.delete('/:id', [auth, admin], async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	
	const genre = await Genre.findByIdAndRemove(req.params.id);
	if (!genre) return res.status(404).send('Genre not found');
	res.send (genre);
});

module.exports = router;












