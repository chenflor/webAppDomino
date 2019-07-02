// const auth = require('./auth');
//gameRooms {game, listOfPlayers}
const gameRooms = [];

function getGameRoom(index){
    return gameRooms[index];
}

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
    return newIndex;
}

function quitGame(playerName,gameName){
    let index = findRoom(gameName);
    if(index !== -1){
        if(gameRooms[index].game.gameStarted === true){
            return false;
        }
        else{
            gameRooms[index].game.registeredPlayers = gameRooms[index].game.registeredPlayers-1;
            let playerI = gameRooms[index].listOfPlayers.find((name) =>{
                return (name === playerName)});
            gameRooms[index].listOfPlayers.splice(playerI,1);
            return true;
        }
    }
    return true;
}

function removePlayerFromRoom(index){
    gameRooms[index].game.registeredPlayers = gameRooms[index].game.registeredPlayers-1;
    let playerI = gameRooms[index].listOfPlayers.find((name) =>{return (name === gameRooms[index].game.gameName)});
    gameRooms[index].listOfPlayers.splice(playerI,1);
}

function startGame(){

}

function deleteGameRoom(){
    
}

module.exports = {addPlayerToGameRoom, findOrCreateGameRoom, startGame, quitGame, deleteGameRoom, findRoom, getGameRoom, removePlayerFromRoom}