import React, { Component } from "react";
import gameEnded from "./gameEnded.css"

class GameEnded extends Component {
  constructor(i,j) {
    super();
    this.playerAvgTime = "00:00";
    this.state = {
        allStati : []
    };
    this.getAllStatistics = this.getAllStatistics.bind(this);
  }

  avgTimeToString(stati){
    let minutes = new Date(stati).getMinutes();
    let sec = new Date(stati).getSeconds();
    let playerAvgTime = minutes + ':' + sec;
    return playerAvgTime;
  }

  setStatisticColumn(statistics){
    var temp = this.avgTimeToString(statistics.avgTimeForPlayerTurn);
      return (
        <ul key="statTable">
            <li key="numOfTurns">Num Of Turns: <div>{statistics.numOfTurns}</div></li>
            <li key="timeFromGameStart">Time From Game Start:  <div>{statistics.timeFromGameStart}</div></li>
            <li key="avgTimeForPlayerTurn">Avg Time For Player Turn:  <div>{temp}</div></li>
            <li key="numOfTimesPlayerTookFromCash">Num Of Times Player Took From Cash:  <div>{statistics.numOfTimesPlayerTookFromCash}</div></li>
            <li key="playerScore">Player Score:  <div>{statistics.playerScore}</div></li>
        </ul>
      );
  }

  render() {
    this.getAllStatistics();
    console.log(this.state.allStati);
    return (
      <div>
          <h1>Statistics:</h1>
          <div className = "allStatistics">
          {this.state.allStati.map((player)=> (
              <div key={player.name}>
                  <h2>{player.name} :</h2>
                  {this.setStatisticColumn(player.stati)}
              </div>
          ))}
          </div>
      </div>
    );
  }

  getAllStatistics() {
    console.log("in get");
    return fetch('/gameBoards/getAllStatistics', {method: 'GET', credentials: 'include'})
    .then((response) => {
        if (!response.ok){
            throw response;
        }
        return response.json();            
    })
    .then(stati => {
        this.setState({
            allStati : stati
        });
        console.log(stati);
    })
    .catch(err => {throw err});
}

}

export default GameEnded;