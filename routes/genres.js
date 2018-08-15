const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();

const genreSchema = new mongoose.Schema({
	genre: {type: String, required: true}
});

const Genre = mongoose.model('Genre', genreSchema);

async function createGenre(genreObject){
	const genre = new Genre(genreObject);

	try{
		const result = await genre.save();
		return result;
	}catch (ex) {
		console.log(ex.message);
		return;
	}
}

async function getAllGenres(){
	return await Genre.find().select({ genre: 1});
}

async function getGenreById(id){
	return await Genre.findById(id);
}

async function removeGenre(id) {
	return await Genre.deleteOne({ _id: id});
}

async function updateGenre(id, genreObject){
	const genre = await Genre.findById(id);
	console.log(genre);
	if(!genre) return "Genre not found";

	genre.set(genreObject);

	const result = await genre.save();
	return result;
}

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(3).required()
  };
  return Joi.validate(genre, schema);
}

router.get('/', async (req,res) => {
	try{
		const result = await getAllGenres();
		res.send(result);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

router.get('/:id', async (req, res) => {
	const genreId = req.params.id;
	try{
		const result = await getGenreById(genreId);
		if (!result) res.status(404).send('Genre not found');
		else res.send(result);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

router.post('/', async (req, res) => {
	const { error } = validateGenre(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		const result = await createGenre(req.body);
		res.send(result);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
	
});


 router.put('/:id', async (req, res) => {
 	const { error } = validateGenre(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		const result = await updateGenre(req.params.id, req.body);
		res.send(result);
	}catch (ex){
		res.send('An error occurred: ' + ex.message);
	}
});

 router.delete('/:id', async (req, res) => {
 	try{
 		res.send( await removeGenre(req.params.id));
 	}catch (ex) {
 		res.send('An error occurred: ' + ex.message);
 	}
});

module.exports = router;












