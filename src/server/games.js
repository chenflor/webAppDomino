const auth = require('./auth');
const gameRooms = require('./gameRooms');
//game {gameName, numOfPlayers, userWhoCreated, registeredPlayers, gameStarted}
const gamesList = [];

function addGameToGamesList(req, res, next) {	
	let newGame = {};
	if (auth.getUserInfo(req.session.id) === undefined) {
		res.status(403).send('user does not exist');
	} else {	
		let splitedBody = req.body.split(",");
		for (game in gamesList) {
			const name = game.name;
			if (name === splitedBody[0]) {
				res.status(403).send('game name already exist');
				return;
			}
		}
		newGame = {
			gameName:          splitedBody[0], 
			numOfPlayers:      splitedBody[1], 
			userWhoCreated:    auth.getUserInfo(req.session.id).name, 
			registeredPlayers: 0, 
			gameStarted:       false
		};
		gamesList.push(newGame);
		next();
	}
}

function findGame(name){
	for(let i=0; i<gamesList.length;i++){
		if((new String(gamesList[i].gameName).trim().valueOf()) == (new String(name).trim().valueOf())){
			return i;
		}
	}
	return -1;
}

function registerToGame(req, res, next) {
	let index = findGame(req.body);
	if(index == -1){
		res.status(403).send('game does not exist');
		return;
	}
	else if(gamesList[index].gameStarted === true){
		res.status(403).send('game already started');
		return;
	}
	else if(gamesList[index].registeredPlayers >= gamesList[index].numOfPlayers){
		res.status(403).send('Max number of players in game');
		return;
	}
	else{
		gamesList[index].registeredPlayers = gamesList[index].registeredPlayers + 1;
		let i = gameRooms.findOrCreateGameRoom(gamesList[index]);
		gameRooms.addPlayerToGameRoom(i,auth.getUserInfo(req.session.id).name)
		console.log(gamesList[index].registeredPlayers);
		console.log(gamesList[index].numOfPlayers);

		if(gamesList[index].registeredPlayers == gamesList[index].numOfPlayers){
			console.log("Here");
			gamesList[index].gameStarted = true;
			gameRooms.startGame();
		}
	}
	next();
}

function deleteGame(req, res, next) {	
	let index = findGame(req.body);
	if(index == -1){
		res.status(403).send('game does not exist');
		return;
	}
	else if(auth.getUserInfo(req.session.id).name != gamesList[index].userWhoCreated){
		res.status(403).send('user did not create this game');
		return;
	}
	else if(gamesList[index].gameStarted || gamesList[index].registeredPlayers > 0){
		res.status(403).send('Can not delete game, game has started or has registered players');
		return;
	}
	else {						
		gamesList.splice(index, 1);
		// console.log(gamesList);
		next();
	}
}


function getAllGames(){
	return gamesList;
}

module.exports = {addGameToGamesList, getAllGames, registerToGame, deleteGame}
