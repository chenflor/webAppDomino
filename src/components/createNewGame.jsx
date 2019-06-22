import React from 'react';
import ReactDOM from 'react-dom';

export default class createNewGame extends React.Component {
    constructor(args) {
        super(...args);        

        this.state = {
            sendInProgress:false
        };

        this.sendNewGame = this.sendNewGame.bind(this);
    }

    render() {               
        return(
            <form className="create-game-wrapper" onSubmit={this.sendNewGame}>
                <h3>Create New Game</h3>
                <input disabled={this.state.sendInProgress} placeholder="enter game name" ref={input => this.inputName = input}/>
                <p>Number of players</p> 
                <input type="number" name="numberOfPlayers" min="2" max="3" disabled={this.state.sendInProgress} ref={input => this.inputNumber = input}></input>
                <br></br>
                <input type="submit" className="btn" disabled={this.state.sendInProgress} value="Send" />
            </form>
        )
    }   

    sendNewGame(e) {
        e.preventDefault();
        this.setState(()=>({sendInProgress: true}));
        const gameName = this.inputName.value;
        const numOfPlayers = this.inputNumber.value;
        fetch('/games/createNewGame', {
            method: 'POST',
            body: gameName + "," + numOfPlayers,
            credentials: 'include'
        })
        .then(response => {            
            if (!response.ok) {                
                throw response;
            }
            this.setState(()=>({sendInProgress: false}));
            this.inputName.value = '';
            this.inputNumber.value = '';               
        });
        return false;
    }
}