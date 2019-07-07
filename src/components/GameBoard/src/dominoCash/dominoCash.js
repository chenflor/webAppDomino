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
          
    }

    getARandomDomino(){
      this.setState({sendInProgress: true});
      const that = this;
      fetch('/gameRooms/getARandomDomino', {method: 'GET', credentials: 'include'})
          .then(response => {            
              if (!response.ok) {               
                  throw response;
              }
              return response.json();
                      
          }).then(randomDomino => {
              console.log(randomDomino); 
              that.setState({sendInProgress: false});
              that.props.getNewDominoFromCash(randomDomino);
              return randomDomino; 
          }).catch(err => {throw err});
        
    }



    getNewDominoFromCash(){
      this.numOfTimesPlayerTookFromCash = this.numOfTimesPlayerTookFromCash + 1;
      this.getARandomDomino();
    }

    render() {
      return (
        <div className = "dominoCash">
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