const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
	"Action",
	"Adventure",
	"Comedy",
	"Drama",
	"Fantasy",
	"Horror",
	"Romance",
	"Sci-Fi",
	"Triller",
	"Urban",
	"Western",
];

function validateGenre(genre) {
  const schema = {
    genre: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

app.get('/', (req,res) => {
	res.send('Welcome to Vidly. Rent a movie of your choosing :)');
});

app.get('/api/genres', (req,res) => {
	// List all existing genres
	res.send(genres);
});

app.get('/api/genres/:genre', (req, res) => {
	const genre = genres.find(c => c === req.params.genre);
	if (!genre) return res.status(404).send('Genre not found');
	else res.send(genre + " movies");
});

app.post('/api/genres', (req, res) => {
	const { error } = validateGenre(req.body); 
  	if (error) return res.status(400).send(error.details[0].message);

	const newGenre = req.body.genre;
	genres.push(newGenre);
	res.send(newGenre + " added.");
});


app.put('/api/genres/:genre', (req, res) => {
	const genre = genres.find(c => c === req.params.genre);
	if (!genre) return res.status(404).send('Genre not found');

	const {error} = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const newGenre = req.body.genre;
	genres[genres.indexOf(genre)] = newGenre;
	res.send(newGenre);
});

app.delete('/api/genres/:genre', (req, res) => {
	const genre = genres.find(c => c === req.params.genre);
	if (!genre) return res.status(404).send('Genre not found');

	// Delete genre
	const genreIndex = genres.indexOf(genre);
	genres.splice(genreIndex,1);

	res.send(genre);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));