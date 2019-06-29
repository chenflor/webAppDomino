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
        playerScore : 0
      };
    }

    changeDominos(dominos){
      var total = 0;
      this.setState({playerDominos : dominos, selectedDomino : dominos[0]});
      for(var i=0; i<this.state.playerDominos.length; i++ ){
        total = total + this.state.playerDominos[i].firstNum + this.state.playerDominos.secondNum; 
      }
      this.setState({playerScore : total});
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
        this.setPlayersScore(true,newDomino.firstNum + newDomino.secondNum);
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
      }
      this.setPlayersScore(false,dominoToBeRemoved.firstNum + dominoToBeRemoved.secondNum);
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

    resetStatAndCangeDominos(dominos){
      this.numOfTurns = 0;
      this.isNewGame = !this.isNewGame;
      this.playerTookFromCash = 0;
      this.changeDominos(dominos);
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
    setPlayersScore(add,sum){
      let total = 0;
      if(add){
        total = this.state.playerScore + sum;
      }
      else{
        total = this.state.playerScore - sum;
      }
      this.setState({playerScore : total});
    }

    addToNumOfTurns(){
      this.numOfTurns = this.numOfTurns + 1;
    }

    render() {
      return (
        <div className = "playerSide">
        <div className = "playerBox">
            <DominoCash 
            resetStatAndCangeDominos={this.resetStatAndCangeDominos.bind(this)} 
            getNewDominoFromCash={this.getNewDominoFromCash.bind(this)} 
            newGame = {this.props.newGame}
            numOfTimesPlayerTookFromCash  = {this.props.numOfTimesPlayerTookFromCash}
            insertDominoToGameBoard = {this.insertDominoToGameBoard.bind(this)} 
            setPlayersScore = {this.setPlayersScore.bind(this)}/>
            {this.gameStatus()}
            <DominoPieces 
            dominos = {this.state.playerDominos} 
            selectedDomino = {this.state.selectedDomino} 
            validNumbers = {this.props.validNumbers}
            setSelected ={this.setSelected.bind(this)}/>
        </div>
          <Statistics
            numOfTurns = {this.numOfTurns}
            isNewGame = {this.isNewGame}
            playerTookFromCash = {this.playerTookFromCash}
            playerScore = {this.state.playerScore}/>
        </div>
      );
    }
  }
  export default PlayerBox;
