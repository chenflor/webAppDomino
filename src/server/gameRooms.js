const games = require('./games');
//gameRooms {game, listOfPlayers}
const gameRooms = [];

function addPlayerToGameRoom(index, player){
    gameRooms[index].listOfPlayers.push(player);
}

function findRoom(name){
    for(let i=0; i<gameRooms.length;i++){
		if((new String(gameRooms[i].game.gameName).trim().valueOf()) == (new String(name).trim().valueOf())){
			return i;
		}
	}
	return -1; 
}

function findOrCreateGameRoom(thisGame){
    let newIndex = findRoom(thisGame.gameName);
    if(newIndex == -1){
        let gameRoom = {
            game: thisGame,
            listOfPlayers: []
        };
        newIndex = gameRooms.push(gameRoom)-1;
    }
    // console.log(gameRooms);
    return newIndex;
}

function quitGame(req, res, next){
    let index = findRoom(req.body);
    if(gameRooms[index].game.gameStarted === true){
        res.status(403).send('you can not quit the game now');
        return;
    }
    else{
        gameRooms[index].game.registeredPlayers = gameRooms[index].game.registeredPlayers-1;
        let playerI = gameRooms[index].listOfPlayers.find((name) =>{return (name === gameRooms[index].game.gameName)});
        gameRooms[index].listOfPlayers.splice(playerI,1);
        // console.log(gameRooms);
    }
    next();
}

function startGame(){
    
}

function deleteGameRoom(){
    
}

module.exports = {addPlayerToGameRoom, findOrCreateGameRoom, startGame, quitGame, deleteGameRoom}