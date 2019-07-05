import React from 'react';
import ReactDOM from 'react-dom';

export default class gamesArea extends React.Component {
    constructor(args) {
        super(...args);
        this.currentGame = {};
        this.state = {
            games: [],
            sendInProgress:false
        };        

        this.registerToGame = this.registerToGame.bind(this);
        this.getGames = this.getGames.bind(this);
        this.deleteGame= this.deleteGame.bind(this);
    }

    componentDidMount() {
        this.getGames();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    render() {
        return(
            <form className="games-area-wrpper">
            <h3>Games</h3>
             {this.state.games.map((game) => (
                <div key={game.gameName}>
                    <div ref={input => this.thisName = input} name = "nameOfGame" >{game.gameName} 
                    <button onClick={() => (this.deleteGame(game))}>Delete</button>
                    </div>
                    <h5> 
                        created by {game.userWhoCreated}, registered: {game.registeredPlayersCounter}/{game.numOfPlayers} status: {(game.gameStarted) ? "STARTED" : "waiting"}
                    </h5>
                    <button className="btn" onClick={() => this.registerToGame(game)} disabled={this.state.sendInProgress}>register</button>
                </div>))}
            </form>
        )
    }

    getGames(){
        return fetch('/games/allGames', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId = setTimeout(this.getGames, 200);
            return response.json();            
        })
        .then(newGames => {
            this.setState(()=>({games : newGames}));
            
        })
        .catch(err => {throw err});
    }

    registerToGame(game){
        console.log("HERE in register game");
        this.setState(()=>({sendInProgress: true}));
        fetch('/games/registerToGame', {
            method: 'POST',
            body: game.gameName,
            credentials: 'include'
        })
        .then(response => {            
            if (!response.ok) {
                this.props.handleRegisterError();                
                console.log("GGGGGGG");
                console.log(response);
                throw response;
            }
            console.log("HHHHHHHHHH");
            return response.json();
                    
        }).then(curGame => {
            console.log(curGame);
            this.props.handleSuccessedRegister(curGame);
            this.props.enterGameRoom(curGame);
            this.setState(()=>({sendInProgress: false}));      
        }).catch(err => {throw err});
        return false; 
    }

    deleteGame(game){
        this.setState(()=>({sendInProgress: true}));
        fetch('/games/deleteGame', {
            method: 'POST',
            body: game.gameName,
            credentials: 'include'
        })
        .then(response => { 
            if (response.status === 403) {
                response.text().then((data) => alert(data));
            }           
            else if (!response.ok) {             
                throw response;
            }
            else{ this.setState(()=>({sendInProgress: false}));}            
        });
        return false; 
    }
}