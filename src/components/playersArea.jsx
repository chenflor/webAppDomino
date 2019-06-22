import React from 'react';
import ReactDOM from 'react-dom';

export default class playersArea extends React.Component {
    constructor(args) {
        super(...args);
        
        this.state = {
            players: []
        };        

        this.getPlayers = this.getPlayers.bind(this);
    }

    componentDidMount() {
        this.getPlayers();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    render() {         
        return(
            <div className="players-area-wrpper">
            <h3>Players</h3>
             {this.state.players.map((player) => (<div key={player}> {player} </div>))}
            </div>
        )
    }

    getPlayers() {
        return fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
        .then((response) => {
            if (!response.ok){
                throw response;
            }
            this.timeoutId = setTimeout(this.getPlayers, 200);
            return response.json();            
        })
        .then(players => {
            this.setState(()=>({players}));
        })
        .catch(err => {throw err});
    }
}