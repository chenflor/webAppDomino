const express = require('express');
const router = express.Router();
const gameRooms = require('./gameRooms');
const auth = require('./auth');

const gameRoomsManagement = express.Router();

// gameRoomsManagement.post('/quitGame', gameRooms.quitGame, (req, res) => {		
// 	res.sendStatus(200);	
// });

// gameRoomsManagement.get('/allGames', (req, res) => {
// 	res.json(games.getAllGames());
// });


gameRoomsManagement.get('/getARandomDomino',(req, res) => {
	res.json(gameRooms.getARandomDomino(auth.getUserInfo(req.session.id).name,true));	
});
gameRoomsManagement.get('/getInitialDominos',(req, res) => {
	let initialDominos = [];
	let userName = auth.getUserInfo(req.session.id).name;
	for(var i=0; i<6;i++){
		initialDominos.push(gameRooms.getARandomDomino(userName,false));
	}		
	res.json(initialDominos);	
});

module.exports = gameRoomsManagement;