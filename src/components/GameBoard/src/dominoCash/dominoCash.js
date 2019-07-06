import React, { Component } from "react";
import dominoCashTheme from "./dominoCashTheme.css";
import propTypes from "prop-types"


class DominoCash extends Component {

    constructor(props) {
      super(props);
      this.length = 28;
      this.numOfTimesPlayerTookFromCash = 0;
      this.gameStartTime = 0;
      this.timeFromGameStart = 0;
      this.state = {
        sendInProgress:false
    }; 
     // this.dominosCashArray = this.initDominoCashArray();
          
    }

    getARandomDomino(){
      this.setState(()=>({sendInProgress: true}));
        fetch('/gameRooms/getARandomDomino', {method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok) {               
                throw response;
            }
            return response.json();
                    
        }).then(randomDomino => {
            console.log(randomDomino); 
            this.setState(()=>({sendInProgress: false}));
            return randomDomino; 
        }).catch(err => {throw err});
        // return false; 
    }

    newGame(){
      this.props.newGame();
     // this.dominosCashArray = this.initDominoCashArray();
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
      //need to add async await
      var newDomino = this.getARandomDomino();
      console.log(newDomino);
      this.props.getNewDominoFromCash(newDomino);
    }

    render() {
      return (
        <div className = "dominoCash">
            {/* <button onClick={this.newGame.bind(this)}>New Game</button> */}
            <button onClick={this.props.insertDominoToGameBoard}>insertDominoToGameBoard</button>
            <button onClick={this.getNewDominoFromCash.bind(this)} disabled={this.state.sendInProgress}>New Domino</button>
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