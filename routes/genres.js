const express = require('express');
const router = express.Router();

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

router.get('/', (req,res) => {
	// List all existing genres
	res.send(genres);
});

router.get('/:genre', (req, res) => {
	const genre = genres.find(c => c === req.params.genre);
	if (!genre) return res.status(404).send('Genre not found');
	else res.send(genre + " movies");
});

router.post('/', (req, res) => {
	const { error } = validateGenre(req.body); 
  	if (error) return res.status(400).send(error.details[0].message);

	const newGenre = req.body.genre;
	genres.push(newGenre);
	res.send(newGenre + " added.");
});


router.put('/:genre', (req, res) => {
	const genre = genres.find(c => c === req.params.genre);
	if (!genre) return res.status(404).send('Genre not found');

	const {error} = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const newGenre = req.body.genre;
	genres[genres.indexOf(genre)] = newGenre;
	res.send(newGenre);
});

router.delete('/:genre', (req, res) => {
	const genre = genres.find(c => c === req.params.genre);
	if (!genre) return res.status(404).send('Genre not found');

	// Delete genre
	const genreIndex = genres.indexOf(genre);
	genres.splice(genreIndex,1);

	res.send(genre);
});

module.exports = router;












