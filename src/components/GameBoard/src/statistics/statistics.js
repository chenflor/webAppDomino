import React, { Component } from "react";
import statisticsTheme from "./statisticsTheme.css";
import dominoCash from "../dominoCash/dominoCash.js"
import DominoCash from "../dominoCash/dominoCash.js";


class Statistics extends Component {
  constructor(i,j) {
    super();
    this.isNewGameToggle = false;
    this.state = {
        newGameStartTime: 0,
        numOfTurns: 0,
        timeFromGameStart: 0,
        avgTimeForPlayerTurn: 0,
        numOfTimesPlayerTookFromCash: 0,
        playerScore: 0
    };
  }

  componentWillMount(){
    setInterval(function(){
      if(this.props.isNewGame != this.isNewGameToggle){
        this.setState({newGameStartTime : new Date()});
        this.isNewGameToggle = !this.isNewGameToggle;
      }
      else if(this.state.newGameStartTime){
        let newTime = "";
        let minutes = new Date().getMinutes() - (this.state.newGameStartTime).getMinutes();
        let sec = new Date().getSeconds();
        newTime = minutes + ':' + sec;
        this.setState({
          timeFromGameStart: newTime
        })
      }
      this.setState({
        numOfTurns: this.props.numOfTurns,
        avgTimeForPlayerTurn: 0,
        numOfTimesPlayerTookFromCash: this.props.playerTookFromCash,
        playerScore: this.props.playerScore
      })

    }.bind(this), 1000);
  }


  render() {
    return (
      <div className = "statistics">
          <h1>Statistics:</h1>
          <ul key="statTable">
            <li key="numOfTurns">Num Of Turns: <div>{this.state.numOfTurns}</div></li>
            <li key="timeFromGameStart">Time From Game Start:  <div>{this.state.timeFromGameStart}</div></li>
            <li key="avgTimeForPlayerTurn">Avg Time For Player Turn:  <div>{this.state.avgTimeForPlayerTurn}</div></li>
            <li key="numOfTimesPlayerTookFromCash">Num Of Times Player Took From Cash:  <div>{this.state.numOfTimesPlayerTookFromCash}</div></li>
            <li key="playerScore">Player Score:  <div>{this.state.playerScore}</div></li>
        </ul>
      </div>
    );
  }
}
export default Statistics;