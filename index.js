const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const clients = require('./routes/clients');
const home = require('./routes/home');

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/clients', clients)
app.use('/', home);

mongoose.connect('mongodb://localhost/vidly')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.error('Could not connect to MongoDB', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));