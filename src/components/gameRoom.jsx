import React from 'react';
import ReactDOM from 'react-dom';
import GamePanelContaier from './gamePanelContainer.jsx';
import DominoBoard from './GameBoard/src/dominoBoard/dominoBoard.jsx';
import PropTypes from 'prop-types';

//game {gameName, numOfPlayers, userWhoCreated,registeredUsersList registeredPlayersCounter, gameStarted}


export default class GameRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerQuit : false,
            currGame : props.currGame
        };
        this.quitHandler= this.quitHandler.bind(this);
        this.updateGameFromServer = this.updateGameFromServer.bind(this);
        // this.hasGameStarted = this.hasGameStarted.bind(this);

    }

    componentDidMount() {
        // console.log("componentDidMount");
        this.updateGameFromServer();
        //this.setState({playerQuit : this.state.playerQuit, gameStarted : this.props.currGame.gameStarted})
        // this.getGames();
    }
    componentWillUnmount(){
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    // updateGame(currGame){
    //     this.setState({currGame : currGame});
    // }
    updateGameFromServer(){
        // console.log("updating Game From Server");
        fetch('/games/getCurrentGame', {method:'Get', credentials: 'include'})
        .then(response=> {            
            if (response.ok){
                // console.log(response);
                this.timeoutId = setTimeout(this.updateGameFromServer, 400);
                return response.json();
            } else {              
                    throw response;
                }      
        }).then(currentGame =>{
            this.setState({currGame : currentGame});
            // console.log(currentGame);
            
        }).catch(err => {throw err});
    }
    

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    render() {
        // this.hasGameStarted();
        let dominoBoard =(<h2>"Game has not started"</h2>);
        if (this.state.currGame.gameStarted){
            dominoBoard = (<DominoBoard/>);
        }
        return (<div className="game-room-wrpper">
        <button className="logout btn" onClick={this.quitHandler}>quit</button>
        <React.Fragment>{dominoBoard}</React.Fragment>
        </div>);
    }

    quitHandler(){
        const that = this;
        fetch('/users/quitGame', {
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
                that.setState(()=>({playerQuit:true}));

                that.props.exitGameRoom();
            }
        });
        return false; 
    }
    
}

GameRoom.propTypes ={
    currGame : PropTypes.object
};
