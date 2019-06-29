import React, { Component } from "react";
import dominoGameBoardTheme from "./dominoGameBoardTheme.css";
import CellInBoard from "../cellInBoard/cellInBoard.js"



class DominoGameBoard extends Component {
  constructor(props) {
    super(props);
    this.index1 = 0;
    this.index2 = 0;
    
  }

  displayCell(DominoGameCell){
        let newKey = "";
        newKey = DominoGameCell.firstNum.toString() + DominoGameCell.secondNum.toString() + this.index1;
        this.index1 = this.index1 + 1;
        return(
            <CellInBoard key = {newKey}
                isDisplayed  = {DominoGameCell.isDisplayed} 
                firstNum     = {DominoGameCell.firstNum} 
                secondNum    = {DominoGameCell.secondNum} 
                isHorizontal = {DominoGameCell.isHorizontal}
                isPotential  = {DominoGameCell.isPotential}/>
        );
  }

  createKey(dominoGameCells){
    let key = "";
    if(dominoGameCells){
      dominoGameCells.forEach(element => {
        key = key + element.firstNum + element.secondNum + this.index2;
      });
      this.index2 = this.index2 + 1;
    }
    return key;
  }

  render() {
    return (
        <div className = "playingBoard">
            {this.props.dominosBoard.map(function(dominoGameCells){
                return(
                    <div className="playingBoardRow" key = {this.createKey(dominoGameCells)}>  
                        {(dominoGameCells.map(function(dominoGameCell) {
                            return(this.displayCell(dominoGameCell));
                        }.bind(this)))}
                    </div>
                    );
            }.bind(this))}
    </div>
    );
  }
}
export default DominoGameBoard;