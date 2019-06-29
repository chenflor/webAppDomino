import React, { Component } from "react";
import dominoPieceTheme from "./dominoPieceTheme.css";
import propTypes from "prop-types"

  class DominoPiece extends Component {
    constructor(props){
      super(props);
      this.setSelected = this.setSelected.bind(this);
    }

  setDominoNumbers(dotPlace,number){
    var dotclassName = "dot";
    switch(dotPlace) {
      case 1:
      case 9:
        if(number > 2){
          dotclassName = dotclassName + " visible";
        }
      break;
      case 3:
      case 7:
        if(number > 3){
          dotclassName = dotclassName + " visible";
        }
        break;
      case 4:
      case 6:
        if(number == 2 || number == 6){
          dotclassName = dotclassName + " visible";
        }
        break;
      case 5:
        if(number == 1 || number == 5 || number == 3){
          dotclassName = dotclassName + " visible";
        }
        break;  
      default: null;
    }
        
    return dotclassName;
  }

  setSelected(){
    let domino = {firstNum : this.props.firstNum, secondNum : this.props.secondNum};
    this.props.setSelected(domino);
  }

  isOptionalNumber(firstNum,secondNum){
    let className = "";
    if(this.props.validNumbers){
      if(!(this.props.validNumbers.includes(firstNum)||
        this.props.validNumbers.includes(secondNum))){
          className = " isNotValidPiece";
        }
    }
    return className;
  }

  isPotentialDominoOnBoard(){
    let className = "";
    if(this.props.isPotential){
      className = " isPotential"
    }
    return className;
  }

  ishorizontal(){
    let className = "";
    if(this.props.isHorizontal){
      className = " horizontal"
    }
    return className;
  }

  render() {
    let selectedClassString = "";
    if (this.props.isSelected){
      selectedClassString = "dominoPiece-selected"
    }
    return (
      <div 
        className = {"dominoPiece " + selectedClassString
                       + this.isOptionalNumber(this.props.firstNum,this.props.secondNum)
                       + this.isPotentialDominoOnBoard() 
                       + this.ishorizontal()} 
        onClick={this.setSelected}>
        <table className = "upSection">
        <tbody>
            <tr className="row">
              <th className={this.setDominoNumbers(1,this.props.firstNum)}> </th>
              <th className={this.setDominoNumbers(2,this.props.firstNum)}></th>
              <th className={this.setDominoNumbers(3,this.props.firstNum)}></th>
            </tr>
            <tr className="row">
              <th className={this.setDominoNumbers(4,this.props.firstNum)}></th>
              <th className={this.setDominoNumbers(5,this.props.firstNum)}></th>
              <th className={this.setDominoNumbers(6,this.props.firstNum)}></th>
            </tr>
            <tr className="row">
              <th className={this.setDominoNumbers(7,this.props.firstNum)}></th>
              <th className={this.setDominoNumbers(8,this.props.firstNum)}></th>
              <th className={this.setDominoNumbers(9,this.props.firstNum)}></th>
            </tr>
            </tbody>
          </table>
          <hr className="line"></hr>
          <table className = "buttomSection">
          <tbody>
            <tr className="row">
              <th className={this.setDominoNumbers(1,this.props.secondNum)}> </th>
              <th className={this.setDominoNumbers(2,this.props.secondNum)}></th>
              <th className={this.setDominoNumbers(3,this.props.secondNum)}></th>
            </tr>
            <tr className="row">
              <th className={this.setDominoNumbers(4,this.props.secondNum)}></th>
              <th className={this.setDominoNumbers(5,this.props.secondNum)}></th>
              <th className={this.setDominoNumbers(6,this.props.secondNum)}></th>
            </tr>
            <tr className="row">
              <th className={this.setDominoNumbers(7,this.props.secondNum)}></th>
              <th className={this.setDominoNumbers(8,this.props.secondNum)}></th>
              <th className={this.setDominoNumbers(9,this.props.secondNum)}></th>
            </tr>
            </tbody>
          </table>
        </div>
    );
  }
}

DominoPiece.propTypes ={
  firstNum : propTypes.number,
  secondNum : propTypes.number,
  isSelected : propTypes.bool,
  setSelected : propTypes.func
};

  
export default DominoPiece;