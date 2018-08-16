const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();

const genreSchema = new mongoose.Schema({
	genre: {type: String, required: true}
});

const Genre = mongoose.model('Genre', genreSchema);

function isMongoIdValid(id){
	if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
	else return false;
}

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(3).required()
  };
  return Joi.validate(genre, schema);
}

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

router.post('/', async (req, res) => {
	const { error } = validateGenre(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		let genre = new Genre(req.body);
		genre = await genre.save();
		res.send(genre);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
	
});


 router.put('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const { error } = validateGenre(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {new: true});
		if (!genre) return res.status(404).send('Genre not found');
		res.send(genre);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

 router.delete('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const genre = await Genre.findByIdAndRemove(req.params.id);

	if (!genre) return res.status(404).send('Genre not found');

	res.send (genre);
});

module.exports = router;












