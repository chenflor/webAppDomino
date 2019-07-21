// const auth = require('./auth');
const gameBoards = require('./gameBoards');
// const games = require('./games.js');
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
    let index = findGameIndexByPlayer(name);
    if(index ==-1){
        console.warn("Called findGameNameByPlayer for a player that is not in a game");
        return "";
    }
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

function findOrCreateGameRoom(thisGame, gameHasFinshed){
    let newIndex = findRoom(thisGame.gameName);
    if(newIndex == -1){
        let gameRoom = {
            game: thisGame,
            listOfPlayers: [],
            gameRoomActive : false,
            gameHasFinshed : gameHasFinshed
        };
        newIndex = gameRooms.push(gameRoom)-1;
    }
    return newIndex;
}

function quitGame(playerName, gameName){
    let index = findRoom(gameName);
    if(index !== -1){
        if(gameRooms[index].game.gameStarted === true){
            let game = gameBoards.getGameBoard(gameName);
             //If player has finshed the game, let him exit (dont update room display)
            if(game.activePlayersList.indexOf(playerName) == -1 || game.gameEnded){
                if(game.gameEnded && gameRooms[index].gameRoomActive){
                    gameHasFinshed(index);
                }
                return true;
            }
            return false;
            
        }
        else{
            pIndex = gameRooms[index].listOfPlayers.indexOf(playerName);
            if(pIndex > -1){
                gameRooms[index].game.registeredPlayersCounter--;
                gameRooms[index].listOfPlayers.splice(pIndex,1);
            }
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
function isCashEmpty(playerName){
    var indexOfGame = findGameIndexByPlayer(playerName);
    let curGameCash = gameRooms[indexOfGame].cashOfDominos;
    if(curGameCash.length<1){
        return true;
    }
    return false;
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
        gameBoards.playerStatistics.get(playerName).numOfTimesPlayerTookFromCash++;
        gameBoards.resetStuckPlayers(gameRooms[indexOfGame].game.gameName);
        gameBoards.changeTookFromCash(playerName + " took from cash");
    }

    gameBoards.updatePlayerScore(playerName,ans, true);
    return ans;
  }

function startGame(index){
    gameRooms[index].gameRoomActive = true;
    gameRooms[index].cashOfDominos = initDominoCashArray();
    gameBoards.newGame(gameRooms[index].game.gameName, gameRooms[index].game.registeredUsersList);
}
function gameHasFinshed(index){
    if(index > -1 && index < gameRooms.length){
        gameRooms[index].listOfPlayers = [];
        gameRooms[index].gameRoomActive = false;
        gameRooms[index].cashOfDominos = initDominoCashArray();
        gameRooms[index].gameHasFinshed();
        //gameRooms.splice(index,1);
        
    }
}


module.exports = {addPlayerToGameRoom, findOrCreateGameRoom, startGame, 
                  quitGame, gameHasFinshed, findRoom,
                  getGameRoom, removePlayerFromRoom, getARandomDomino,
                  findGameNameByPlayer, isCashEmpty}