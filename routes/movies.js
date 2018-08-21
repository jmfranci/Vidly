//Routes
const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {isMongoIdValid} = require('../utils/functions');
const {Movie, validateMovie} = require('../models/movies');
const {Genre} = require('../models/genres');

router.get('/', async (req,res) => {
	const movies = await Movie.find().sort('title');
	res.send(movies);
});

router.get('/:id', async (req, res) => {
	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');

	const movie = await Movie.findById(req.params.id);

	if (!movie) return res.status(404).send('Movie not found');
	
	res.send (movie);
});

router.post('/', auth, async (req, res) => {
	const { error } = validateMovie(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);

   	if (!isMongoIdValid(req.body.genreId))
   		return res.status(404).send('Invalid Id');
   	const genre = await Genre.findById(req.body.genreId);
   	if(!genre) return res.status(400).send('Invalid Genre');

	try{
		let movie = new Movie({
			title: req.body.title,
			genre: {
				_id: genre._id, 
				genre: genre.genre
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		});
		movie = await movie.save();
		res.send(movie);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
	
});


 router.put('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const { error } = validateMovie(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true});
		if (!movie) return res.status(404).send('Movie not found');
		res.send(movie);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

  router.delete('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const movie = await Movie.findByIdAndRemove(req.params.id);

	if (!movie) return res.status(404).send('Movie not found');

	res.send (movie);
});

module.exports = router;