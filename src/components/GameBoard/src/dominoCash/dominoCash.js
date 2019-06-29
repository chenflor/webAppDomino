import React, { Component } from "react";
import dominoCashTheme from "./dominoCashTheme.css";
import propTypes from "prop-types"
// import * as math from 'mathjs'


class DominoCash extends Component {

  initDominoCashArray(){
    //Initializing a 28 pieces domino array.
    let ansArray =[];
    let index = 0;
    this.length = 28;
    for(var i=0; i<=6;i++){
      for(var j = i;j<=6;j++){
        ansArray[index] = {firstNum : i, secondNum : j};
        index++;
        if(index > this.length){
          console.error("There is a bug in the code - too many pieces are initialized");
          return null;
        }
      }
    }
    return ansArray;
  }

    constructor(props) {
      super(props);
      this.length = 28;
      this.numOfTimesPlayerTookFromCash = 0;
      this.gameStartTime = 0;
      this.timeFromGameStart = 0;
      this.dominosCashArray = this.initDominoCashArray();
          
    }

    getARandomDomino(){
      if(this.length<1){
        console.info("No Domino pieces left in Cash, returning null");
        return null;
      }
      var max = this.length-1;
      var min = 0;
      var index = Math.floor(Math.random()*(max-min+1)+min);
      var ans = this.dominosCashArray[index];
      var tempArray = [];
      var j = 0;
      for(var i = 0; i<this.length-1; i++){
          if(j == index){
              j = j+1;
          }
          tempArray[i] = this.dominosCashArray[j];
          j = j+1;
      }
      this.dominosCashArray = tempArray;
      this.length = this.length - 1;
      return ans;
    }

    newGame(){
      this.props.newGame();
      this.dominosCashArray = this.initDominoCashArray();
      var newSixDominos = [];
        for(var i = 0; i< 6 ;i++){
          let newDomino = this.getARandomDomino();
          newSixDominos[i] = newDomino;
        }
      this.props.resetStatAndCangeDominos(newSixDominos);
      this.numOfTimesPlayerTookFromCash = 0;
      
    }

    getNewDominoFromCash(){
      this.numOfTimesPlayerTookFromCash = this.numOfTimesPlayerTookFromCash + 1;
      var newDomino = this.getARandomDomino();
      this.props.getNewDominoFromCash(newDomino);
    }

    render() {
      return (
        <div className = "dominoCash">
            <button onClick={this.newGame.bind(this)}>New Game</button>
            <button onClick={this.props.insertDominoToGameBoard}>insertDominoToGameBoard</button>
            <button onClick={this.getNewDominoFromCash.bind(this)}>New Domino</button>
        </div>
      );
    }

}

  DominoCash.propTypes ={
    getNewDominoFromCash         : propTypes.func,
    changeDominos                : propTypes.func,
    insertDominoToGameBoard      : propTypes.func,
    numOfTimesPlayerTookFromCash : propTypes.number
  };
  
  export default DominoCash;