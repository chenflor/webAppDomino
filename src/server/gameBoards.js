//{key:gameName, value:board}
var gamesData = new Map();

const INITIAL_DOMINO_VALUES = {
  isDisplayed  : false, 
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
    newGameBoardData.gameName = gameName;
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

function createPotentialCell(number,pRow,pCol,row,col,isFirstNum,horizon){
  return(
    {
      number       : number,
      potentialRow : pRow,
      potentialCol : pCol,
      isFirstNum   : isFirstNum,
      row          : row,
      col          : col,
      horizontal   : horizon
    }
  );
}
// _addToPotentialAroundDomino(domino,row,col){
//   if(domino.isHorizontal){
//     if((row-1) >= 0){
//       this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row-1,col,row,col,true,true));
//     }
//     if((row+1)<this.rows){
//       this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row+1,col,row,col,false,true));
//     }
//     if(this.isDoubleDomino(domino)){
//       if((col-1) >= 0){
//         this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row,col-1,row,col,true,false));
//       }
//       if((col+1) < this.cols){
//         this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row,col+1,row,col,false,false));
//       }
      
//     }
//   }
//   else{
//     if((col-1) >= 0){
//       this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row,col-1,row,col,true,false));
//     }
//     if((col+1) < this.cols){
//       this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row,col+1,row,col,false,false));
//     }
//     if(this.isDoubleDomino(domino)){
//       if((row-1) >= 0){
//         this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row-1,col,row,col,true,true));
//       }
//       if((row+1)<this.rows){
//         this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row+1,col,row,col,false,true));
//       }
//     }
//   }
// }

// removeMarkedDominos(){
//   for(var i =0; i<this.potentialDominos.length;i++){
//     let potentialDomino = this.potentialDominos[i];
//     if(this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = true){
//       this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = false;
//     }
//   }
//   this.setState({dominosBoard : this.state.dominosBoard});
// }

// updatePotentialDominoes(domino,row,col){
//   this.removeMarkedDominos();
//   if(this.potentialDominos.length == 0){
//     this._addToPotentialAroundDomino(domino,row,col);
    
//   }
//   else{
//     let tmpArr =[];
//     this._addToPotentialAroundDomino(domino,row,col);
//     for(var i =0; i<this.potentialDominos.length;i++){
//       let potentialDomino = this.potentialDominos[i];
//       if(this.state.dominosBoard[potentialDomino.potentialRow][potentialDomino.potentialCol].isDisplayed == false){
//         tmpArr.push(potentialDomino);
//       }
//     }
//     this.potentialDominos = tmpArr;
   
//   }
//   let validNumbers = [];
//   this.potentialDominos.forEach(
//     (potential)=>{if (validNumbers.indexOf(potential.number)==-1) validNumbers.push(potential.number)});
//   this.setState({validNumbers:validNumbers});
// }







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

function insertDominoToGameBoard(playerDominoToBeInserted, gameName){
  console.log("In insertDominoToGameBoard" + playerDominoToBeInserted );
  console.log("gameName " + gameName);
  if(canDominoBeInsertedToGameBoard(playerDominoToBeInserted, gameName)){
    let dominoCell = createDominoCellFromPlayerDomino(playerDominoToBeInserted);
    let location = whereDominoCanBeinserted(dominoCell,gameName);
    if(location){
      gamesData.get(gameName).dominosBoard[location.row][location.col] = dominoCell;
      gamesData.get(gameName).firstRound = false;
      return true;
      //updatePotentialDominoes(dominoCell,location.row,location.col);
    }  
  }
  else{
    console.warn("Tried to insert a cell that was already occupid");
    return false;
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

module.exports = {getGameBoard, newGame, insertDominoToGameBoard};