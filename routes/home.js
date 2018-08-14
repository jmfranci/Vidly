const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
	res.send('Welcome to Vidly. Rent a movie of your choosing :)');
});

module.exports = router;