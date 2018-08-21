const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {User, validateUser} = require('../models/users');
const {isMongoIdValid} = require('../utils/functions');

router.get('/me', auth, async(req,res) => {
	const user = await User.findById(req.user._id).select('-password');
	res.send(user);
});

router.post('/', async (req, res) => {
	const { error } = validateUser(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	
   	let user = await User.findOne({email: req.body.email});
   	if (user) return res.status(400).send('User already registered');

	try{
		user = new User(_.pick(req.body, ['name', 'email', 'password']));
		const salt = await bcrypt.genSalt(10); 
		user.password = await bcrypt.hash(req.body.password, salt);

		user = await user.save();

		const token = await user.generateAuthToken();
		res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
	}catch (ex){
		res.send("An error has occurred: " + ex.message);
	}
});

module.exports = router;