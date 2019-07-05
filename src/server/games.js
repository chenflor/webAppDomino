const auth = require('./auth');
const gameRooms = require('./gameRooms');
//game {gameName, numOfPlayers, userWhoCreated,registeredUsersList registeredPlayersCounter, gameStarted}
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
			gameName				: splitedBody[0], 
			numOfPlayers			: splitedBody[1], 
			userWhoCreated			: auth.getUserInfo(req.session.id).name,
			registeredUsersList 	: [], 
			registeredPlayersCounter: 0, 
			gameStarted				: false
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

function findGameFromUserName(req,res,next){
	console.log("findGameFromUserName")
	let found = false;
	let name = auth.getUserInfo(req.session.id).name;
	console.log(gamesList);
	for(var i =0; i< gamesList.length; i++){
		if(gamesList[i].registeredUsersList.indexOf(name)>=0){
			res.locals.currentGame = gamesList[i];
			found = true;
			break;
		}
	}
	if(!found){
		res.status(403).send("User is not in a game");
		return;
	}
	next();
}

function registerToGame(req, res, next) {
	console.log("In register game");
	let index = findGame(req.body);
	if(index == -1){
		res.status(403).send('game does not exist');
		return;
	}
	else if(gamesList[index].gameStarted === true){
		res.status(403).send('game already started');
		return;
	}
	else if(gamesList[index].registeredPlayersCounter >= gamesList[index].numOfPlayers){
		res.status(403).send('Max number of players in game');
		return;
	}
	else{
		let userName = auth.getUserInfo(req.session.id).name;
		gamesList[index].registeredPlayersCounter++;
		gamesList[index].registeredUsersList.push(userName);
		let i = gameRooms.findOrCreateGameRoom(gamesList[index]);
		gameRooms.addPlayerToGameRoom(i,userName);
		if(gamesList[index].registeredPlayersCounter == gamesList[index].numOfPlayers){
			gamesList[index].gameStarted = true;
			gameRooms.startGame();
		}
	}
	res.locals.currentGame = gamesList[index];
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
	else if(gamesList[index].gameStarted || gamesList[index].registeredPlayersCounter > 0){
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

module.exports = {addGameToGamesList, getAllGames, registerToGame, deleteGame, findGameFromUserName}
