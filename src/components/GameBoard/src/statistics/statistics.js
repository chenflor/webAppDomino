import React, { Component } from "react";
import statisticsTheme from "./statisticsTheme.css";


class Statistics extends Component {
  constructor(i,j) {
    super();
    this.isNewGameToggle = false;
    this.playerAvgTime = "00:00";
    this.state = {
        newGameStartTime: 0,
        numOfTurns: 0,
        timeFromGameStart: "00:00",
        startTimeForPlayerTurn: 0,
        avgTimeForPlayerTurn: 0,
        numOfTimesPlayerTookFromCash: 0,
        playerScore: 0
    };
    this.getStatistics = this.getStatistics.bind(this);
    this.avgTimeToString = this.avgTimeToString.bind(this);
  }

  componentDidMount() {
    this.getStatistics();
 }

 componentWillUnmount() {
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }
 }

  avgTimeToString(){
    let minutes = new Date(this.state.avgTimeForPlayerTurn).getMinutes();
    let sec = new Date(this.state.avgTimeForPlayerTurn).getSeconds();
    this.playerAvgTime = minutes + ':' + sec;
  }

  render() {
    this.avgTimeToString();
    return (
      <div className = "statistics">
          <h1>Statistics:</h1>
          <ul key="statTable">
            <li key="numOfTurns">Num Of Turns: <div>{this.state.numOfTurns}</div></li>
            <li key="timeFromGameStart">Time From Game Start:  <div>{this.state.timeFromGameStart}</div></li>
            <li key="avgTimeForPlayerTurn">Avg Time For Player Turn:  <div>{this.playerAvgTime}</div></li>
            <li key="numOfTimesPlayerTookFromCash">Num Of Times Player Took From Cash:  <div>{this.state.numOfTimesPlayerTookFromCash}</div></li>
            <li key="playerScore">Player Score:  <div>{this.state.playerScore}</div></li>
        </ul>
      </div>
    );
  }

  getStatistics() {
    return fetch('/gameBoards/getPlayerStatistics', {method: 'GET', credentials: 'include'})
    .then((response) => {
        if (!response.ok){
            throw response;
        }
        this.timeoutId = setTimeout(this.getStatistics, 200);
        return response.json();            
    })
    .then(stati => {
        this.setState({
          numOfTurns                   : stati.numOfTurns,
          timeFromGameStart            : stati.timeFromGameStart,
          avgTimeForPlayerTurn         : stati.avgTimeForPlayerTurn,
          numOfTimesPlayerTookFromCash : stati.numOfTimesPlayerTookFromCash,
          playerScore                  : stati.playerScore
        });
    })
    .catch(err => {throw err});
}

}
export default Statistics;