const express = require('express');
const router = express.Router();
const gameRooms = require('./gameRooms');

const gameRoomsManagement = express.Router();

gameRoomsManagement.post('/quitGame', gameRooms.quitGame, (req, res) => {		
	res.sendStatus(200);	
});

// gameRoomsManagement.get('/allGames', (req, res) => {
// 	res.json(games.getAllGames());
// });




module.exports = gameRoomsManagement;