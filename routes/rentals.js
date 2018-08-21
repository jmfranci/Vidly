//Routes
const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {isMongoIdValid} = require('../utils/functions');
const {Rental, validateRental} = require('../models/rentals');
const {Movie} = require('../models/movies');
const {Client} = require('../models/clients');
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req,res) => {
	const rentals = await Rental.find();
	res.send(rentals);
});

router.get('/:id', async (req, res) => {
	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');

	const rental = await Rental.findById(req.params.id);

	if (!rental) return res.status(404).send('Rental not found');
	
	res.send (rental);
});

router.post('/', auth, async (req, res) => {
	const { error } = validateRental(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);

   	if (!isMongoIdValid(req.body.clientId))
   		return res.status(404).send('Invalid Client Id');
   	if (!isMongoIdValid(req.body.movieId))
   		return res.status(404).send('Invalid Movie Id');

   	const client = await Client.findById(req.body.clientId);
   	if(!client) return res.status(400).send('Invalid Client');

   	const movie = await Client.findById(req.body.movieId);
   	if(!movie) return res.status(400).send('Invalid Movie');

   	if (movie.numberInStock === 0) res.status(400).send('Movie out of stock');

	try{
		let rental = new Rental({
			client: {
				_id: client._id,
				name: client.name,
				isGold: client.isGold,
				phone: client.phone
			},
			movie: {
				_id: movie._id,
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate
			},
		});

		try{
			//Allow us to simulate a transaction so that the operations are safer.
			//Basically the operations inside the Fawn task are treated atomically.
			new Fawn.Task()
				.save('rentals', rental)
				.update('movies', { _id: movie._id }, {
					$inc: { numberInStock: -1}
				})
				.run();
		}catch(ex){
			res.status(500).send('Something went wrong');
		}


		res.send(rental);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
	
});


 router.put('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const { error } = validateRental(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	try{
		const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, {new: true});
		if (!rental) return res.status(404).send('Rental not found');
		res.send(rental);
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

  router.delete('/:id', async (req, res) => {
 	if (!isMongoIdValid(req.params.id)) 
		return res.status(404).send('Invalid Id');
	const rental = await Rental.findByIdAndRemove(req.params.id);

	if (!rental) return res.status(404).send('Rental not found');

	res.send (rental);
});

module.exports = router;