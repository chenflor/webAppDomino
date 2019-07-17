// const auth = require('./auth');
const gameBoards = require('./gameBoards');
const initialCashSize = 28;
//gameRooms {game, listOfPlayers, cashOfDominos}
const gameRooms = [];
function getGameRoom(index){
    return gameRooms[index];
}

function addPlayerToGameRoom(index, player){
    gameRooms[index].listOfPlayers.push(player);
}

function findGameIndexByPlayer(name){
    for(let i=0; i<gameRooms.length;i++){
        for(let j=0; j<gameRooms[i].listOfPlayers.length;j++){
		    if((new String(gameRooms[i].listOfPlayers[j]).trim().valueOf()) == (new String(name).trim().valueOf())){
			    return i;
		    }
        }
    }
	return -1; 
}

function findGameNameByPlayer(name){
    var index = findGameIndexByPlayer(name);
    return gameRooms[index].game.gameName;
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
            gameRooms[index].game.registeredPlayersCounter--;
            let playerI = gameRooms[index].listOfPlayers.find((name) =>{
                return (name === playerName)});
            gameRooms[index].listOfPlayers.splice(playerI,1);
            return true;
        }
    }
    return true;
}

function removePlayerFromRoom(index){
    gameRooms[index].game.registeredPlayersCounter--;
    let playerI = gameRooms[index].listOfPlayers.find((name) =>{return (name === gameRooms[index].game.gameName)});
    gameRooms[index].listOfPlayers.splice(playerI,1);
}

function initDominoCashArray(){
    //Initializing a 28 pieces domino array.
    let ansArray =[];
    let index = 0;
    for(var i=0; i<=6;i++){
      for(var j = i;j<=6;j++){
        ansArray[index] = {firstNum : i, secondNum : j};
        index++;
        if(index > initialCashSize){
          console.error("There is a bug in the code - too many pieces are initialized");
          return null;
        }
      }
    }
    if(index < initialCashSize){
        console.error("There is a bug in the code - too little pieces are initialized");
        return null;
    }
    return ansArray;
}

function getARandomDomino(playerName, nextTurn){
    var indexOfGame = findGameIndexByPlayer(playerName);
    let curGameCash = gameRooms[indexOfGame].cashOfDominos;
    if(curGameCash.length<1){
      console.info("No Domino pieces left in Cash, returning null");
      return null;
    }
    let max = curGameCash.length-1;
    let min = 0;
    let index = Math.floor(Math.random()*(max-min+1)+min);
    let ans = gameRooms[indexOfGame].cashOfDominos[index];
    let tempArray = [];
    let j = 0;
    for(var i = 0; i<curGameCash.length-1; i++){
        if(j == index){
            j = j+1;
        }
        tempArray[i] = gameRooms[indexOfGame].cashOfDominos[j];
        j = j+1;
    }
    gameRooms[indexOfGame].cashOfDominos = tempArray;
    if(nextTurn){
        gameBoards.nextTurn(gameRooms[indexOfGame].game.gameName);
        gameBoards.playerStatistics.get(playerName).numOfTimesPlayerTookFromCash = gameBoards.playerStatistics.get(playerName).numOfTimesPlayerTookFromCash + 1;
        gameBoards.changeTookFromCash(playerName + " took from cash");
    }
    return ans;
  }

function startGame(index){
    gameRooms[index].cashOfDominos = initDominoCashArray();
    gameBoards.newGame(gameRooms[index].game.gameName, gameRooms[index].game.registeredUsersList);
}
function deleteGameRoom(){
    
}


module.exports = {addPlayerToGameRoom, findOrCreateGameRoom, startGame, 
                  quitGame, deleteGameRoom, findRoom,
                  getGameRoom, removePlayerFromRoom, getARandomDomino,
                  findGameNameByPlayer}