import React from 'react';
import ReactDOM from 'react-dom';
import GamePanelContaier from './gamePanelContainer.jsx';
import Board from './GameBoard/src/dominoBoard/dominoBoard.jsx'
import DominoBoard from './GameBoard/src/dominoBoard/dominoBoard.jsx';
import PropTypes from 'prop-types';

export default class GameRoom extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            playerQuit : false,
            gameStarted : false
        };
        this.quitHandler= this.quitHandler.bind(this);

    }

    componentDidMount() {
        this.setState({playerQuit : this.state.playerQuit, gameStarted : this.props.currGame.gameStarted})
        // this.getGames();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    render() {  
        if(this.state.playerQuit){
            return (
                <GamePanelContaier disableLogout = {this.props.disableLogout}/>   
                
            );
        }   
        else{
            let dominoBoard =(<h2>"Game has not started"</h2>);
            console.log("this.props.currGame");
            console.log(this.props.currGame);
            if (this.state.gameStarted){
                dominoBoard = (<DominoBoard/>);
            }
            return (<div className="game-room-wrpper">
            <button className="logout btn" onClick={this.quitHandler}>quit</button>
            <React.Fragment>{dominoBoard}</React.Fragment>
            </div>);
        }   
        
    }

    hasGameStarted(){
        if(this.props.currGame.gameStarted){
            this.props.disableLogout(true);
        }
    }

    quitHandler(){
        fetch('/gameRooms/quitGame', {
            method: 'POST',
            body: this.props.currGame.gameName,
            credentials: 'include'
        })
        .then(response => { 
            if (response.status === 403) {
                response.text().then((data) => alert(data));
            }           
            else if (!response.ok) {             
                throw response;
            }
            else{
                this.setState(()=>({playerQuit:true}));
            }
        });
        return false; 
    }
    
}

GameRoom.propTypes ={
    currGame : PropTypes.object
};
