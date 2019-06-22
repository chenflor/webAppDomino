const express = require('express');
const router = express.Router();
const games = require('./games');

const gamesManagement = express.Router();

gamesManagement.post('/createNewGame', games.addGameToGamesList, (req, res) => {		
	res.sendStatus(200);	
});

gamesManagement.get('/allGames', (req, res) => {
	res.json(games.getAllGames());
});

gamesManagement.post('/registerToGame', games.registerToGame,(req, res) => {
	res.sendStatus(200);
});

gamesManagement.post('/deleteGame', games.deleteGame,(req, res) => {
	res.sendStatus(200);
});


module.exports = gamesManagement;