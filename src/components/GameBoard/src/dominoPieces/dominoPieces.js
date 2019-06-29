import React from "react";
import propTypes from "prop-types"
import DominoPiece from "../dominoPiece/dominoPiece";
import dominoPiecesTheme from "./dominoPiecesTheme.css";
import DominoUtils from "../dominoUtils/dominoUtils";

function DominoPieces(props){
    return (
        <div className = "dominoPieces">
            {props.dominos.map(domino => 
            <DominoPiece 
            key={domino.firstNum.toString() +domino.secondNum.toString()}
             firstNum = {domino.firstNum} 
             secondNum = {domino.secondNum}
             isSelected = {DominoUtils.isDominoEqual(props.selectedDomino, domino) }
             validNumbers = {props.validNumbers}
             setSelected = {props.setSelected}/>)}
        </div>

    )

}

DominoPieces.propTypes ={
    dominos        : propTypes.array,
    selectedDomino : propTypes.object,
    setSelected    : propTypes.func
}

export default DominoPieces;