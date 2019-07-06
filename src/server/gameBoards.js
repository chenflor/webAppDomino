//{key:gameName, value:board}
var gamesData = new Map();

const INITIAL_DOMINO_VALUES = {
  isDisplayed  : true, //change later
  firstNum     : 1,
  secondNum    : 2,
  isHorizontal : false
};

const initBoardData = {
    gameName         : "",
    dominosBoard     : null,
    validNumbers     : [0,1,2,3,4,5,6],
    playersList      : [],
    rows             : 14,
    cols             : 7,
    firstRound       : true,
    potentialDominos : [],
};

function initBoard() {
    var board = new Array;
    for (var row = 0; row < initBoardData.rows; row++) {
      board[row] = new Array;
      for (var col = 0; col < initBoardData.cols; col++) {
        board[row][col] = INITIAL_DOMINO_VALUES;
      }
    }
    return board;
};

function newGame(gameName , playersList){
    console.log("new game in game boards" + gameName);
    var newGameBoardData = initBoardData;

    newGameBoardData.playersList = playersList;
    newGameBoardData.potentialDominos = [];
    newGameBoardData.dominosBoard = initBoard();
    newGameBoardData.validNumbers = [0,1,2,3,4,5,6];
    gamesData.set(gameName, newGameBoardData);

};
function isDoubleDomino(domino){
    if(domino.firstNum == domino.secondNum){
        return true;
    }
    return false;
};

function whereDominoCanBeinserted(domino, gameName){
    let ans;
    curGameData = gamesData.get(gameName);
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
    return this.whereDominoCanBeinserted(domino,gameName)!=undefined;
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

function insertDominoToGameBoard(playerDominoToBeInserted, gameName){
    if(this.canDominoBeInsertedToGameBoard(playerDominoToBeInserted, gameName)){
      let dominoCell = this.createDominoCellFromPlayerDomino(playerDominoToBeInserted);
      let location = this.whereDominoCanBeinserted(dominoCell,gameName);
      if(location){
        gamesData.get(gameName).dominosBoard[location.row][location.col] = dominoCell;
        this.updatePotentialDominoes(dominoCell,location.row,location.col);
      }  
    }
    else{
      console.warn("Tried to insert a cell that was already occupid");
    }
    if(this.firstRound){
      this.firstRound = false;
    }
    
};

function removeMarkedDominos(){
    for(var i =0; i<this.potentialDominos.length;i++){
      let potentialDomino = this.potentialDominos[i];
      if(this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = true){
        this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = false;
      }
    }
    this.setState({dominosBoard : this.state.dominosBoard});
  }


function calcPotentialDominos(playerDominoToBeInserted,gameName){
    this.removeMarkedDominos();
    let potentialDominos = gamesData.get(gameName).potentialDominos;
    for(var i =0; i<potentialDominos.length;i++){
      let potentialDomino = potentialDominos[i];
      if((potentialDomino.number === playerDominoToBeInserted.firstNum)||
        (potentialDomino.number === playerDominoToBeInserted.secondNum)){
        gamesData.get(gameName).dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = true;
      } 
    }
    this.setState({dominosBoard : this.state.dominosBoard});
  }


function getGameBoard(gameName){
    let ans = gamesData.get(gameName);
    return ans;
};

module.exports = {getGameBoard, newGame};