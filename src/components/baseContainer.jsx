import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import GamePanelContaier from './gamePanelContainer.jsx';
import GameRoom from './gameRoom.jsx';

export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            showLogin: true,
            isInGameRoom: false,
            // disLogout : false,
            currGame: {},
            currentUser: {
                name: ''
            }
        };
        
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.exitGameRoom = this.exitGameRoom.bind(this);
        this.enterGameRoom = this.enterGameRoom.bind(this);

        this.getUserName();
    }
    
    render() {        
        if (this.state.showLogin) {
            return (<LoginModal 
                loginSuccessHandler={this.handleSuccessedLogin} 
                loginErrorHandler={this.handleLoginError}/>);
        }
        else if(this.state.isInGameRoom){
            console.log("In Game Room");
            return (<GameRoom currGame = {this.state.currGame}/>);
        }
        return this.renderGamePanel();
    }

    exitGameRoom(){
        this.setState({isInGameRoom : false, currGame :{}});        

    }
    handleSuccessedLogin() {
        this.setState({showLogin:false, currentUser : {name :this.getUserName}});        
    }

    handleLoginError() {
        console.error('login failed');
        this.setState(()=>({showLogin:true}));
    }

    enterGameRoom(newGame){
        this.setState(()=>({currGame:newGame,isInGameRoom : true}));
    }

    getUserName() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser:userInfo, showLogin: false}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({showLogin: true}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }

    renderGamePanel() {
        return(
            <div className="chat-base-container">
                <div className="user-info-area">
                    Hello {this.state.currentUser.name}
                    <button className="logout btn" onClick={this.logoutHandler} disabled={this.state.disableLogout}>Logout</button>
                </div>
                <GamePanelContaier exitGameRoom = {this.exitGameRoom} enterGameRoom = {this.enterGameRoom}/>                
            </div>
        )
    }

    // fetch('/users/logout', {method: 'GET', credentials: 'include'})
            // .then(response => {
            //     if (!response.ok) {
            //         console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            //     }
            // this.setState(()=>({currentUser: {name:''}, showLogin: true}));
            // })
    logoutHandler() {
        fetch('/users/logout', {
            method: 'POST',
            body: this.state.currGame.gameName,
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
                this.setState(()=>({currentUser: {name:''}, showLogin: true}));
            }
        });
        return false;      
    }
}