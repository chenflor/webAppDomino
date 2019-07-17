//{key:gameName, value:board}
var gamesData = new Map();
var playerStatistics = new Map();
var tookFromCash = " ";

const INITIAL_DOMINO_VALUES = {
  isDisplayed  : false, 
  firstNum     : 1,
  secondNum    : 2,
  isHorizontal : false
};
const rows = 14;
const cols = 7;
const initBoardData = {
    gameName          : "",
    dominosBoard      : null,
    gameEnded         : false,
    validNumbers      : [0,1,2,3,4,5,6],
    activePlayersList : [],
    playersWon        : [],
    firstRound        : true,
    potentialDominos  : [],
    currentPlayerTurn : ""
};

function addPlayerWon(playerName, gameName){
  let gameData = gamesData.get(gameName);
  let index = gameData.activePlayersList.indexOf(playerName);
  if(index > -1){
    gameData.activePlayersList.splice(index,1);
    gameData.playersWon.push(playerName);
    updateHasGameEnded(gameName);
    return true;
  
  }
  return false;
  
}

function updateHasGameEnded(gameName){
  let gameData = gamesData.get(gameName)
  if(gameData.activePlayersList.length ==1 ){
    gameData.playersWon.push(gameData.activePlayersList[0]);
    gameData.gameEnded = true;
  }
  else if(gameData.activePlayersList.length ==0){
    gameData.gameEnded = true;
  }
  else{
    gameData.gameEnded = false;
  }
}
function initBoard() {
    var board = new Array;
    for (var row = 0; row < rows; row++) {
      board[row] = new Array;
      for (var col = 0; col < cols; col++) {
        board[row][col] = INITIAL_DOMINO_VALUES;
      }
    }
    return board;
};

function newGame(gameName , activePlayersList){
    console.log("new game in game boards" + gameName);
    var newGameBoardData = new Object();
    newGameBoardData.gameName = gameName;
    newGameBoardData.gameEnded  = false;
    newGameBoardData.activePlayersList = activePlayersList;
    newGameBoardData.potentialDominos = [];
    newGameBoardData.playersWon = [];
    newGameBoardData.firstRound = true;
    newGameBoardData.dominosBoard = initBoard();
    newGameBoardData.validNumbers = [0,1,2,3,4,5,6];
    newGameBoardData.currentPlayerTurn = activePlayersList[0];
    gamesData.set(gameName, newGameBoardData);
    for(index in activePlayersList){
      let startGameStati = new Object();
      startGameStati.newGameStartTime = new Date();
      startGameStati.numOfTurns = 0;
      startGameStati.timeFromGameStart = 0;
      startGameStati.startTimeForPlayerTurn = 0;
      startGameStati.avgTimeForPlayerTurn = 0;
      startGameStati.numOfTimesPlayerTookFromCash = 0;
      startGameStati.playerScore = 0;
      playerStatistics.set(activePlayersList[index], startGameStati);
    }
    playerStatistics.get(newGameBoardData.currentPlayerTurn).startTimeForPlayerTurn = new Date();
};

function isDoubleDomino(domino){
    if(domino.firstNum == domino.secondNum){
        return true;
    }
    return false;
};

function createPotentialCell(number,pRow,pCol,row,col,isFirstNum,isHorizontal){
  return(
    {
      number       : number,
      potentialRow : pRow,
      potentialCol : pCol,
      isFirstNum   : isFirstNum,
      row          : row,
      col          : col,
      horizontal   : isHorizontal
    }
  );
}
function isLocationEmptyInGameBorad(gameName,row, col){
  return (gamesData.get(gameName).dominosBoard[row][col].isDisplayed == false);
}
function inBoundsOFMatrix(x_loc,y_loc,max_x_loc,max_y_loc){
  if(x_loc <0 || x_loc > max_x_loc){
    return false;
  }
  if(y_loc < 0 || y_loc > max_y_loc){
    return false;
  }
  return true;
}
function _insertToPotentialDominos(gameName,dominoNum,row,col,isFirstNum,isHorizontal){
  let potentialDominos = gamesData.get(gameName).potentialDominos; 
  if(inBoundsOFMatrix(row,col,rows,cols) && isLocationEmptyInGameBorad(gameName,row,col)){
    potentialDominos.push(createPotentialCell(dominoNum,row,col,row,col,isFirstNum,isHorizontal));
  }
}
function _addToPotentialAroundDomino(gameName,domino,row,col){
  if(domino.isHorizontal){
    _insertToPotentialDominos(gameName,domino.firstNum,row-1,col,true,true);
    _insertToPotentialDominos(gameName,domino.secondNum,row+1,col,false,true);
    if(isDoubleDomino(domino)){
      _insertToPotentialDominos(gameName,domino.firstNum,row,col-1,true,false);
      _insertToPotentialDominos(gameName,domino.secondNum,row,col+1,false,false);
    }
  }
  else{
    _insertToPotentialDominos(gameName,domino.firstNum,row,col-1,true,false);
    _insertToPotentialDominos(gameName,domino.secondNum,row,col+1,false,false);
    if(isDoubleDomino(domino)){
      _insertToPotentialDominos(gameName,domino.firstNum,row-1,col,true,true);
      _insertToPotentialDominos(gameName,domino.secondNum,row+1,col,false,true);
    }
  }
};

function removeMarkedDominos(gameName){
  let potential = gamesData.get(gameName).potentialDominos;
  for(var i =0; i<potential.length;i++){
    let potentialDomino = potential[i];
    if(gamesData.get(gameName).dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = true){
      gamesData.get(gameName).dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = false;
    }
  }
}

function updatePotentialDominoes(gameName, domino,row,col){
  removeMarkedDominos(gameName);
  let potentialDominos = gamesData.get(gameName).potentialDominos
  if(potentialDominos.length == 0){
    _addToPotentialAroundDomino(gameName, domino,row,col);
    
  }
  else{
    let tmpArr =[];
    _addToPotentialAroundDomino(gameName, domino,row,col);
    for(var i =0; i<potentialDominos.length;i++){
      let potentialDomino = potentialDominos[i];
      if(gamesData.get(gameName).dominosBoard[potentialDomino.potentialRow][potentialDomino.potentialCol].isDisplayed == false){
        tmpArr.push(potentialDomino);
      }
    }

    gamesData.get(gameName).potentialDominos = tmpArr;
    potentialDominos = gamesData.get(gameName).potentialDominos
   
  }
  let validNumbers = [];
  potentialDominos.forEach(
    (potential)=>{if (validNumbers.indexOf(potential.number)==-1) validNumbers.push(potential.number)});
  gamesData.get(gameName).validNumbers = validNumbers;
};



function whereDominoCanBeinserted(domino, gameName){
    let ans;
    let curGameData = gamesData.get(gameName);
    if(curGameData.firstRound){
      ans = {row : 7, col : 3};
    }
    else{
        for(var i=0;i< curGameData.potentialDominos.length;i++){
            let potential = curGameData.potentialDominos[i];
            let endLoop, reverse;
            if((potential.number == domino.firstNum)){
                reverse = potential.isFirstNum;
                endLoop = true;
            }
            else if(potential.number == domino.secondNum){
                reverse = !potential.isFirstNum;
                endLoop = true;
            }
            ans =  {row : potential.potentialRow, col: potential.potentialCol};
            domino.isHorizontal = (isDoubleDomino(domino))? !potential.horizontal : potential.horizontal;
            if (endLoop){
                if (reverse){
                    let tmp = domino.firstNum;
                    domino.firstNum = domino.secondNum;
                    domino.secondNum =  tmp;
                }
                break;
            }
        }
    }
    
    return ans;
};

function canDominoBeInsertedToGameBoard(domino,gameName){
  return whereDominoCanBeinserted(domino,gameName)!=undefined;
};


function createDominoCellFromPlayerDomino(playerDomino){
    return ({
      isDisplayed     : true,
      firstNum        : playerDomino.firstNum,
      secondNum       : playerDomino.secondNum,
      isHorizontal    : true,
      isPotential     : false
    });
  };

function updateAvgPlayerTime(startTime, name){
  var oldAvg = playerStatistics.get(name).avgTimeForPlayerTurn;
  var turns = playerStatistics.get(name).numOfTurns;
  var now = new Date().getTime();
  var turnTime = now - new Date(startTime).getTime();
  if(turns > 1){
    var sum = oldAvg*(turns - 1);
    var avg = (turnTime + sum)/turns;
    playerStatistics.get(name).avgTimeForPlayerTurn = avg;
  }
  else if(turns === 1){
    playerStatistics.get(name).avgTimeForPlayerTurn = turnTime;
  }
}

function nextTurn(gameName){
  let activePlayersList = gamesData.get(gameName).activePlayersList;
  let currentPlayerTurn = gamesData.get(gameName).currentPlayerTurn;
  let index = activePlayersList.indexOf(currentPlayerTurn);
  playerStatistics.get(currentPlayerTurn).numOfTurns = playerStatistics.get(currentPlayerTurn).numOfTurns + 1;
  updateAvgPlayerTime(playerStatistics.get(currentPlayerTurn).startTimeForPlayerTurn, currentPlayerTurn);
  var newPlayer;
  if (index==(activePlayersList.length-1)){
    newPlayer = activePlayersList[0];
    gamesData.get(gameName).currentPlayerTurn = newPlayer;
  }
  else{
    newPlayer = activePlayersList[index+1];
    gamesData.get(gameName).currentPlayerTurn = newPlayer;
  }
  playerStatistics.get(newPlayer).startTimeForPlayerTurn = new Date();
  changeTookFromCash(" ");
}

function insertDominoToGameBoard(playerDominoToBeInserted, gameName){
  let insertSucsessfully = false;
  if(canDominoBeInsertedToGameBoard(playerDominoToBeInserted, gameName)){
    let dominoCell = createDominoCellFromPlayerDomino(playerDominoToBeInserted);
    let location = whereDominoCanBeinserted(dominoCell,gameName);
    if(location){
      gamesData.get(gameName).dominosBoard[location.row][location.col] = dominoCell;
      gamesData.get(gameName).firstRound = false;
      insertSucsessfully = true;
      nextTurn(gameName);
      updatePotentialDominoes(gameName, dominoCell, location.row, location.col);

    }  
  }
  else{
    console.warn("Tried to insert a cell that was already occupid");
    insertSucsessfully  = false;
  }

  return insertSucsessfully;

}

function getGameBoard(gameName){
    let ans = gamesData.get(gameName);
    return ans;
}

function getSecondesAndMinutes(startTime){
  let newTime = "00:00";
  if(startTime){
    let minutes = new Date().getMinutes() - startTime.getMinutes();
    let sec = new Date().getSeconds();
    newTime = minutes + ':' + sec;
  }
  return newTime
}

function getPlayerStatistics(playerName){ 
  var playerObj = playerStatistics.get(playerName);
  playerObj.timeFromGameStart = getSecondesAndMinutes(playerStatistics.get(playerName).newGameStartTime);
  return playerStatistics.get(playerName);
}

function changeTookFromCash(newTookFromCash){
  tookFromCash = newTookFromCash;
}

function SomeOneTookFromCash(){
  return tookFromCash;
}

module.exports = {changeTookFromCash,SomeOneTookFromCash, playerStatistics, getGameBoard, newGame, insertDominoToGameBoard, nextTurn, getPlayerStatistics, addPlayerWon};
