const express = require('express');
const router = express.Router();
const gameRooms = require('./gameRooms');
const auth = require('./auth');

const gameRoomsManagement = express.Router();

// const NUMBER_OF_INITIAL_DOMINOS = 2;
const NUMBER_OF_INITIAL_DOMINOS = 6;

// gameRoomsManagement.post('/quitGame', gameRooms.quitGame, (req, res) => {		
// 	res.sendStatus(200);	
// });

// gameRoomsManagement.get('/allGames', (req, res) => {
// 	res.json(games.getAllGames());
// });

gameRoomsManagement.get('/isCashEmpty',(req, res) => {
	res.json({ans : gameRooms.isCashEmpty(auth.getUserInfo(req.session.id).name)});	
});
gameRoomsManagement.get('/getARandomDomino',(req, res) => {
	res.json(gameRooms.getARandomDomino(auth.getUserInfo(req.session.id).name,true));	
});
gameRoomsManagement.get('/getInitialDominos',(req, res) => {
	let initialDominos = [];
	let userName = auth.getUserInfo(req.session.id).name;
	for(var i=0; i<NUMBER_OF_INITIAL_DOMINOS;i++){
		initialDominos.push(gameRooms.getARandomDomino(userName,false));
	}		
	res.json(initialDominos);	
});


module.exports = gameRoomsManagement;