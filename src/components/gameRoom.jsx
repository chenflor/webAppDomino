import React from 'react';
import ReactDOM from 'react-dom';
import GamePanelContaier from './gamePanelContainer.jsx';
import Board from './GameBoard/src/dominoBoard/dominoBoard.jsx'
import DominoBoard from './GameBoard/src/dominoBoard/dominoBoard.jsx';

export default class GameRoom extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            playerQuit : false
        };
        this.quitHandler= this.quitHandler.bind(this);

    }

    componentDidMount() {
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
            return (<div className="game-room-wrpper">
            <button className="logout btn" onClick={this.quitHandler}>quit</button>
            <DominoBoard/> 
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
