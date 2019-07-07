import React, { Component } from "react";
import dominoBoardTheme from "./dominoBoardTheme.css";
import PlayerBox from "../playerBox/PlayerBox.js"
import DominoGameBoard from "../DominoGameBoard/dominoGameBoard.jsx";
import Statistics from "../statistics/statistics.js"
const INITIAL_DOMINO_VALUES = {
  isDisplayed  : false,
  firstNum     : 2,
  secondNum    : 2,
  isHorizontal : false
};

class DominoBoard extends React.Component{
  constructor(props){
    super(props); 
    //This is an array of the numbers that can be inserted.
    this.potentialDominos = [];
    this.initialzionTookPlace = false;
    this.firstRound = true;
    this.rows = 14;
    this.cols = 7;
    this.state = {
      dominosBoard               : this.makeEmptyBoard(),
      validNumbers               : [0,1,2,3,4,5,6]
    };

    this.getDominosBoard = this.getDominosBoard.bind(this);

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
  
  componentDidMount(){
    this.getDominosBoard();
  }
  componentWillUnmount(){
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
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



  insertDominoToGameBoard(playerDominoToBeInserted){
    fetch('/gameBoards/insertDomino', {
        method: 'POST',
        body: JSON.stringify(playerDominoToBeInserted),
        credentials: 'include'
    })
    .then(response => { 
        if (response.status === 403) {
            response.text().then((data) => alert(data));
        }           
        else if (!response.ok) {             
            throw response;
        }
        else{ this.getDominosBoard()}            
    });
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




  getDominosBoard(){
    const that = this;
    fetch('/gameBoards/getGameBoard', {method: 'GET', credentials: 'include'})
    .then(response => {            
        if (!response.ok) {               
            throw response;
        }
        return response.json();
                
    }).then(board => {
        that.setState({dominosBoard: board.dominosBoard, 
          potential :board.potential,
          validNumbers : board.validNumbers});

        this.timeoutId = setTimeout(this.getDominosBoard, 400);
        return board; 
    }).catch(err => {throw err});

  }



  render(){
    return (
      <div className = "board">
        <DominoGameBoard dominosBoard={this.state.dominosBoard}/>
        <PlayerBox 
        validNumbers = {this.state.validNumbers} 
        insertDominoToGameBoard ={this.insertDominoToGameBoard.bind(this)}
        firstRound = {this.firstRound}
        calcPotentialDominos = {this.calcPotentialDominos.bind(this)}/> 
      </div>
    )
  }
}

DominoBoard.propTypes ={
  
};

export default DominoBoard;