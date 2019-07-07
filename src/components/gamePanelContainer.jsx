import React from 'react';
import ReactDOM from 'react-dom';
import CreateNewGame from './createNewGame.jsx';
import PlayersArea from './playersArea.jsx';
import GamesArea from './gamesArea.jsx';
import GameRoom from './gameRoom.jsx';
import propTypes from "prop-types"

export default class gamePanelContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.handleSuccessedRegister = this.handleSuccessedRegister.bind(this);
        this.handleRegisterError = this.handleRegisterError.bind(this);
        this.enterGameRoom = this.enterGameRoom.bind(this);
    }
    
    render() {        
        return (
            <div>
                <h1>Game Room</h1>
                <CreateNewGame/>
                <div className="game-panel-contaier">
                    <PlayersArea/>
                    <GamesArea handleSuccessedRegister={this.handleSuccessedRegister}
                     handleRegisterError={this.handleRegisterError}
                     enterGameRoom={this.enterGameRoom}/>
                </div>
            </div>
        );
    }


    handleSuccessedRegister(game) {
        // console.log("handleSuccessedRegister");
        // console.log(game);
        this.enterGameRoom(game);
    }

    handleRegisterError() {
        console.error('register failed');
        this.props.exitGameRoom();
    }

    enterGameRoom(game){
        this.props.enterGameRoom(game);
    }
}

gamePanelContainer.propTypes ={
    exitGameRoom         : propTypes.func,
    enterGameRoom        : propTypes.func,

};