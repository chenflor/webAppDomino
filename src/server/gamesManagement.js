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

gamesManagement.get('/getCurrentGame', (req, res) => {
	console.log(auth.getUserInfo(req.session.id).name + " HERE");
	res.json(games.findGameFromUserName);
});

gamesManagement.post('/registerToGame', games.registerToGame,(req, res) => {
	console.log(res.locals.currentGame);
	res.json(res.locals.currentGame);
});

gamesManagement.post('/deleteGame', games.deleteGame,(req, res) => {
	res.sendStatus(200);
});


module.exports = gamesManagement;