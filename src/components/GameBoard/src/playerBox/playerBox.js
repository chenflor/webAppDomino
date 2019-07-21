import React, { Component } from "react";
import playerBoxTheme from "./playerBoxTheme.css";
import DominoPiece from "../dominoPiece/dominoPiece";
import DominoCash from "../dominoCash/dominoCash";
import DominoPieces from "../dominoPieces/dominoPieces";
import DominoUtils from "../dominoUtils/dominoUtils";
import Statistics from "../statistics/statistics.js"



class PlayerBox extends Component {
    constructor() {
      super();
      this.maxNumberOfDominos = 6;
      this.numOfTurns = 0;
      this.isNewGame = false;
      this.playerTookFromCash = 0;
      this.state = {
        playerDominos : [],
        selectedDomino : undefined,
      };

      this.updateIfPlayerIsStuck = this.updateIfPlayerIsStuck.bind(this);
      this.checkIsPlayerStuck = this.checkIsPlayerStuck.bind(this);
    }
    componentWillMount(){
      this.setInitialDominos();
    }
    componentDidMount(){
      this.updateIfPlayerIsStuck();
    }
    componentWillUnmount(){
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    isCashEmpty(){
      const that = this;
      fetch('/gameRooms/isCashEmpty', {method: 'GET', credentials: 'include'})
          .then(response => {            
              if (!response.ok) {               
                  throw response;
              }
              return response.json();
                      
          }).then(ans => {
              return ans;
          }).catch(err => {throw err});
        
    }
    checkIsPlayerStuck(validNumbers,dominos){
      if(dominos.length < this.maxNumberOfDominos && !this.isCashEmpty()){
        return false;
      }
      
      for(var domino of dominos){
        if(validNumbers.includes(domino.firstNum) || validNumbers.includes(domino.secondNum)){
          return false;
        }
      }

      return true;

    }
    updateIfPlayerIsStuck(){
      console.log("HERE");
      this.timeoutId = setTimeout(this.updateIfPlayerIsStuck, 400);
      if(!this.props.isItMyTurn){
        return;
      }
      if(this.checkIsPlayerStuck(this.props.validNumbers,this.state.playerDominos)){
        
          fetch('/gameBoards/imStuck', {method: 'POST', credentials: 'include'})
          .then(response => {            
              if (!response.ok) {               
                  throw response;
              }
              });
          this.props.updateBoard;
        }
      }
  
    setInitialDominos(){
      const that = this;
      fetch('/gameRooms/getInitialDominos', {method: 'GET', credentials: 'include'})
          .then(response => {            
              if (!response.ok) {               
                  throw response;
              }
              return response.json();
                      
          }).then(initialDominos => {
              that.changeDominos(initialDominos);
          }).catch(err => {throw err});
        
    }
    changeDominos(dominos){
      var total = 0;
      this.setState({playerDominos : dominos, selectedDomino : dominos[0]});
    }

    getNewDominoFromCash(newDomino){
      if(this.state.playerDominos.length >= this.maxNumberOfDominos){
        alert("Player can have up to 6 domino pieces");
      }
      else if(!newDomino){
        alert("No Dominos left in Cash");
        this.gameStatus();
      }
      else{
        this.state.playerDominos.push(newDomino);
        this.state.selectedDomino = newDomino;
        this.setState({playerDominos : this.state.playerDominos, selectedDomino :newDomino});
        this.playerTookFromCash = this.playerTookFromCash + 1;
      }
      
      this.addToNumOfTurns();
    }

    removeFromplayerDominos(dominoToBeRemoved){
      var index = this.state.playerDominos.indexOf(dominoToBeRemoved);
      if (index > -1) {
        this.state.playerDominos.splice(index, 1);
        this.setState({
          playerDominos : this.state.playerDominos
        });
        if(this.state.playerDominos.length == 0){
          this.playerWon();
        }
      }
    }

    playerWon(){
      console.log("In Player won");
      fetch('/gameBoards/playerWon', {method: 'POST', credentials: 'include'})
          .then(response => {            
              if (!response.ok) {               
                  throw response;
              }
          }).catch(err => {throw err});
    }
    
    insertDominoToGameBoard(){
      if(this.state.selectedDomino!=undefined && 
        this.state.playerDominos.some(domino => DominoUtils.isDominoEqual(domino,this.state.selectedDomino))&&
        (this.props.validNumbers.includes(this.state.selectedDomino.firstNum)||
        this.props.validNumbers.includes(this.state.selectedDomino.secondNum))){
        let tmpPiece = this.state.selectedDomino;
        this.removeFromplayerDominos(this.state.selectedDomino);
        this.setState({selectedDomino : this.state.playerDominos[0]});
        this.props.insertDominoToGameBoard(tmpPiece);
        this.setState({selectedDomino : undefined});
        this.addToNumOfTurns();
      }
      else{
        console.warn("no domino can be inserted");
      }
    }

    gameStatus(){
      if(this.state.playerDominos.length < 1 && !this.props.firstRound){
        alert("Game Over - you won!");
        this.props.newGame();
        this.numOfTurns = 0;
        this.isNewGame = !this.isNewGame;
        this.playerTookFromCash = 0;
      }
    }

    findDominoInPlayerDomino(someDomino){
      for(var i=0; i<this.state.playerDominos.length; i++ ){
        if(DominoUtils.isDominoEqual(someDomino,this.state.playerDominos[i])){
          return this.state.playerDominos[i];
        }
      }
      return null;
    }
    setSelected(selectedDomino){
      if(selectedDomino!=undefined && this.state.playerDominos.some(domino => DominoUtils.isDominoEqual(domino,selectedDomino))){
        let tmp = this.findDominoInPlayerDomino(selectedDomino);
        this.setState({selectedDomino : tmp});
        this.props.calcPotentialDominos(selectedDomino);
      }
    }


    addToNumOfTurns(){
      this.numOfTurns = this.numOfTurns + 1;
    }

    render() {
      return (
        <div className = "playerSide">
        <div className = "playerBox">
            <DominoCash
            isItMyTurn = {this.props.isItMyTurn} 
            getNewDominoFromCash={this.getNewDominoFromCash.bind(this)} 
            numOfTimesPlayerTookFromCash  = {this.props.numOfTimesPlayerTookFromCash}
            insertDominoToGameBoard = {this.insertDominoToGameBoard.bind(this)}/>
            {this.gameStatus()}
            <DominoPieces 
            dominos = {this.state.playerDominos} 
            selectedDomino = {this.state.selectedDomino} 
            validNumbers = {this.props.validNumbers}
            setSelected ={this.setSelected.bind(this)}/>
        </div>
          <Statistics/>
        </div>
      );
    }
  }
  export default PlayerBox;
