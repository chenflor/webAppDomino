import React from 'react';
import ReactDOM from 'react-dom';
import dominoImage from './resources/domino.jpg';

export default class GameRoom extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
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
        return (<div className="game-room-wrpper">
            <button className="logout btn" onClick={this.quitHandler}>quit</button>
        </div>);
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
        });
        return false; 
    }
    
}
