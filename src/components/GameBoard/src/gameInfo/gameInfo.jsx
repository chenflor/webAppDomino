import React, { Component } from "react";
import gameInfoTheme from "./gameInfoTheme.css";
import propTypes from "prop-types";

function CurrentPlayerTurn(props){
    let curPlayerTurnName = props.currentPlayerTurn;
    let turnText = "";
    if(curPlayerTurnName){
      turnText = curPlayerTurnName+ "'s Turn"
    }
    return (<h2>{turnText}</h2>);
}

function PlayersList(props){
    if(props.playersList.length == 0){
        return null;
    }
    else{
        return(
        <ol title={props.title}>
            {props.playersList.map(playerName => <li key = {playerName}>{playerName}</li>)}
        </ol>);
    }
}
function GameInfo(props){
    return(
        <div className = "gameInfo">
            <CurrentPlayerTurn currentPlayerTurn = {props.currentPlayerTurn}/>
            <PlayersList 
            playersList = 
            {props.activePlayers} 
            title ={"Active Players:"} />
            <PlayersList playersList = 
            {props.playersWon}
             title ={"Players Order Placement:"}/>
        </div>
        
    );
}
   
        
GameInfo.propTypes ={
    currentPlayerTurn : propTypes.string,
    activePlayers     : propTypes.array,
    playersWon        : propTypes.array
};

export default GameInfo;