import React, { Component } from "react";
import dominoBoardTheme from "./dominoBoardTheme.css";
import PlayerBox from "../playerBox/PlayerBox.js"
import DominoGameBoard from "../DominoGameBoard/dominoGameBoard.jsx";
import DominoBoardManger from "../dominoBoardManger/dominoBoardManger.js";
import Statistics from "../statistics/statistics.js"

const INITIAL_DOMINO_VALUES = {
  isDisplayed  : false,
  firstNum     : 1,
  secondNum    : 2,
  isHorizontal : false
};


class DominoBoard extends React.Component{
  constructor(props){
    super(props); 
    //This is an array of the numbers that can be inserted.
    this.potentialDominos = [];
    this.firstRound = true;
    this.rows = 14;
    this.cols = 7;
    this.state = {
      dominosBoard               : this.makeEmptyBoard(),
      validNumbers               : [0,1,2,3,4,5,6],
    };
  }
  
  makeEmptyBoard() {
    var board = new Array;
    for (var row = 0; row < this.rows; row++) {
      board[row] = new Array;
      for (var col = 0; col < this.cols; col++) {
        board[row][col] = INITIAL_DOMINO_VALUES;
      }
    }
    return board;
  }
  
  whereDominoCanBeinserted(domino){
    let ans;
    if(this.firstRound){
      ans = {row : 7, col : 3};
    }
    else{
      for(var i=0;i<this.potentialDominos.length;i++){
        let potential = this.potentialDominos[i];
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
        domino.isHorizontal = (this.isDoubleDomino(domino))? !potential.horizontal : potential.horizontal;
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
  }

  canDominoBeInsertedToGameBoard(domino){
    return this.whereDominoCanBeinserted(domino)!=undefined;
  }


  newGame(){
    this.potentialDominos = [];
    this.firstRound = true;
    this.setState({
      dominosBoard : this.makeEmptyBoard(),
      validNumbers : [0,1,2,3,4,5,6]
    });
  }

  isDoubleDomino(domino){
    if(domino.firstNum == domino.secondNum){
        return true;
    }
    return false;
  }

  createPotentialCell(number,pRow,pCol,row,col,isFirstNum,horizon){
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
  _addToPotentialAroundDomino(domino,row,col){
    if(domino.isHorizontal){
      if((row-1) >= 0){
        this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row-1,col,row,col,true,true));
      }
      if((row+1)<this.rows){
        this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row+1,col,row,col,false,true));
      }
      if(this.isDoubleDomino(domino)){
        if((col-1) >= 0){
          this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row,col-1,row,col,true,false));
        }
        if((col+1) < this.cols){
          this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row,col+1,row,col,false,false));
        }
        
      }
    }
    else{
      if((col-1) >= 0){
        this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row,col-1,row,col,true,false));
      }
      if((col+1) < this.cols){
        this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row,col+1,row,col,false,false));
      }
      if(this.isDoubleDomino(domino)){
        if((row-1) >= 0){
          this.potentialDominos.push(this.createPotentialCell(domino.firstNum,row-1,col,row,col,true,true));
        }
        if((row+1)<this.rows){
          this.potentialDominos.push(this.createPotentialCell(domino.secondNum,row+1,col,row,col,false,true));
        }
      }
    }
  }

  removeMarkedDominos(){
    for(var i =0; i<this.potentialDominos.length;i++){
      let potentialDomino = this.potentialDominos[i];
      if(this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = true){
        this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = false;
      }
    }
    this.setState({dominosBoard : this.state.dominosBoard});
  }
  updatePotentialDominoes(domino,row,col){
    this.removeMarkedDominos();
    if(this.potentialDominos.length == 0){
      this._addToPotentialAroundDomino(domino,row,col);
      
    }
    else{
      let tmpArr =[];
      this._addToPotentialAroundDomino(domino,row,col);
      for(var i =0; i<this.potentialDominos.length;i++){
        let potentialDomino = this.potentialDominos[i];
        if(this.state.dominosBoard[potentialDomino.potentialRow][potentialDomino.potentialCol].isDisplayed == false){
          tmpArr.push(potentialDomino);
        }
      }
      this.potentialDominos = tmpArr;
     
    }
    let validNumbers = [];
    this.potentialDominos.forEach(
      (potential)=>{if (validNumbers.indexOf(potential.number)==-1) validNumbers.push(potential.number)});
    this.setState({validNumbers:validNumbers});
  }

  createDominoCellFromPlayerDomino(playerDomino){
    return ({
      isDisplayed     : true,
      firstNum        : playerDomino.firstNum,
      secondNum       : playerDomino.secondNum,
      isHorizontal    : true,
      isPotential     : false
    });
  }

  insertDominoToGameBoard(playerDominoToBeInserted){
    if(this.canDominoBeInsertedToGameBoard(playerDominoToBeInserted)){
      let dominoCell = this.createDominoCellFromPlayerDomino(playerDominoToBeInserted);
      let location = this.whereDominoCanBeinserted(dominoCell);
      if(location){
        this.state.dominosBoard[location.row][location.col] = dominoCell;
        this.setState({dominosBoard : this.state.dominosBoard});
        this.updatePotentialDominoes(dominoCell,location.row,location.col);
      }  
    }
    else{
      console.warn("Tried to insert a cell that was already occupid");
    }
    if(this.firstRound){
      this.firstRound = false;
    }
    
  }

  calcPotentialDominos(playerDominoToBeInserted){
    this.removeMarkedDominos();
    for(var i =0; i<this.potentialDominos.length;i++){
      let potentialDomino = this.potentialDominos[i];
      if((potentialDomino.number === playerDominoToBeInserted.firstNum)||
        (potentialDomino.number === playerDominoToBeInserted.secondNum)){
          this.state.dominosBoard[potentialDomino.row][potentialDomino.col].isPotential = true;
      } 
    }
    this.setState({dominosBoard : this.state.dominosBoard});
  }



  render(){
    return (
      <div className = "board">
        <DominoGameBoard dominosBoard={this.state.dominosBoard}/>
        <PlayerBox 
        validNumbers = {this.state.validNumbers} 
        newGame ={this.newGame.bind(this)} 
        insertDominoToGameBoard ={this.insertDominoToGameBoard.bind(this)}
        firstRound = {this.firstRound}
        calcPotentialDominos = {this.calcPotentialDominos.bind(this)}/> 
      </div>
    )
  }
}

export default DominoBoard;