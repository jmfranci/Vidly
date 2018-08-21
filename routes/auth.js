const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {User} = require('../models/users');
const {isMongoIdValid} = require('../utils/functions');
const Joi = require('joi');

router.post('/', async (req, res) => {
	const { error } = validateUser(req.body); 
   	if (error) return res.status(400).send(error.details[0].message);
	
   	let user = await User.findOne({email: req.body.email});
   	if (!user) return res.status(400).send('Invalid email');

   	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) res.status(400).send('Invalid password');

  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;