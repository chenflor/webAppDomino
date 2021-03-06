import React, { Component } from "react";
import dominoBoardTheme from "./dominoBoardTheme.css";
import PlayerBox from "../playerBox/PlayerBox.js";
import DominoGameBoard from "../DominoGameBoard/dominoGameBoard.jsx";
import Statistics from "../statistics/statistics.js";
import GameInfo from "../gameInfo/gameInfo.jsx";
import GameEnded from "../gameEnded/gameEnded.jsx";

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
    this.firstRound = true;
    this.rows = 14;
    this.cols = 7;
    this.state = {
      dominosBoard       : this.makeEmptyBoard(),
      validNumbers       : [0,1,2,3,4,5,6],
      currentPlayerTurn  : "",
      isItMyTurn         : false,
      playerTookFromCash : "",
      gameEnded          : false,
      activePlayersList   : [],
      playersWon         : []
    };
    this.didSomeOneTookFromCash = this.didSomeOneTookFromCash.bind(this);
    this.getDominosBoard = this.getDominosBoard.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.isItMyTurn = this.isItMyTurn.bind(this);
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
    
    if(!this.state.gameEnded){
      this.getDominosBoard();
      this.isItMyTurn();
      this.didSomeOneTookFromCash();
    }
    
  }
  componentWillUnmount(){
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if(this.TurntimeoutId){
      clearTimeout(this.TurntimeoutId);
    }
    if(this.timeOutIdCash){
      clearTimeout(this.timeOutIdCash);
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

  didSomeOneTookFromCash(){
    fetch('/gameBoards/SomeOneTookFromCash', {method: 'GET', credentials: 'include'})
    .then(response => {            
        if (!response.ok) {               
            throw response;
        }
        return response.json();
                
    }).then(str => {
        this.setState({playerTookFromCash: str});
        this.timeOutIdCash = setTimeout(this.didSomeOneTookFromCash, 400);
    }).catch(err => {throw err});
  }
  updateBoard(){
    console.log("In update board");
    this.getDominosBoard();
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



  isItMyTurn(){
    const that = this;
    fetch('/gameBoards/isItMyTurn', {method: 'GET', credentials: 'include'})
    .then(response => {            
        if (!response.ok) {               
            throw response;
        }
        return response.json();
                
    }).then(isItMyTurnObj => {
        that.setState({isItMyTurn: isItMyTurnObj.isItMyTurn});
        if(!this.state.gameEnded){
          this.TurntimeoutId = setTimeout(this.isItMyTurn, 400);
        }
        
        return this.state.isItMyTurn; 
    }).catch(err => {throw err});
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
          gameEnded : board.gameEnded,
          currentPlayerTurn : board.currentPlayerTurn,
          activePlayersList : board.activePlayersList,
          playersWon   : board.playersWon,
          validNumbers : board.validNumbers});
        if(!this.state.gameEnded){
          this.timeoutId = setTimeout(this.getDominosBoard, 400);
        }
        return board; 
    }).catch(err => {throw err});

  }



  render(){
    if(this.state.gameEnded){
      return (<React.Fragment>
                <GameInfo currentPlayerTurn = {""}
                            activePlayers     = {[]}
                          playersWon        = {this.state.playersWon}/>
                  <GameEnded/>
              </React.Fragment>
      );
    }
    return (
      <div className = "board">
        <div className = "inlineText">
        <GameInfo currentPlayerTurn = {this.state.currentPlayerTurn}
                  activePlayers     = {this.state.activePlayersList}
                  playersWon        = {this.state.playersWon}/>
        <h3>{this.state.playerTookFromCash}</h3></div>
        <DominoGameBoard dominosBoard={this.state.dominosBoard}/>
        <PlayerBox
        updateBoard = {this.updateBoard.bind(this)}
        isItMyTurn   = {this.state.isItMyTurn} 
        validNumbers = {this.state.validNumbers} 
        insertDominoToGameBoard ={this.insertDominoToGameBoard.bind(this)}
        firstRound = {this.firstRound}
        calcPotentialDominos = {this.calcPotentialDominos.bind(this)}/> 
      </div>
    );
  }
}

DominoBoard.propTypes ={
  
};

export default DominoBoard;