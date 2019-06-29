import React from 'react';
import ReactDOM from 'react-dom';
import CreateNewGame from './createNewGame.jsx';
import PlayersArea from './playersArea.jsx';
import GamesArea from './gamesArea.jsx';
import GameRoom from './gameRoom.jsx';

export default class gamePanelContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            isInGameRoom: false,
            currGame: {}
        };
        
        this.handleSuccessedRegister = this.handleSuccessedRegister.bind(this);
        this.handleRegisterError = this.handleRegisterError.bind(this);
        this.setCurrGame = this.setCurrGame.bind(this);
    }
    
    render() {        
        if (this.state.isInGameRoom) {
            console.log(this.state.currGame);
            return (<GameRoom currGame = {this.state.currGame} disableLogout = {this.props.disableLogout}/>)
        }
        return (
            <div>
                <h1>Game Room</h1>
                <CreateNewGame/>
                <div className="game-panel-contaier">
                    <PlayersArea/>
                    <GamesArea handleSuccessedRegister={this.handleSuccessedRegister}
                     handleRegisterError={this.handleRegisterError}
                     setCurrGame={this.setCurrGame}/>
                </div>
            </div>
        );
    }


    handleSuccessedRegister(game) {
        console.log("handleSuccessedRegister");
        console.log(game);
        
        this.setState(()=>({isInGameRoom:true, currGame : game}));        
    }

    handleRegisterError() {
        console.error('register failed');
        this.setState(()=>({isInGameRoom:false}));
    }

    setCurrGame(game){
        console.log("in setCurrGame!");
        this.setState(()=>({currGame : game}));  
    }
}