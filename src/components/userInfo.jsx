import React from 'react';
import Logout from "./logout.jsx"

class UserInfo extends React.Component{
    logoutHandler(){
        this.props.logoutHandler();
    };

    constructor(args) {
        super(...args);
        this.logoutHandler = this.logoutHandler.bind(this);
    }
    render(){
        return(
            <div className="user-info-area">
                 Hello {this.props.userName}
                <Logout logoutHandler = {this.logoutHandler}/>
            </div>);
    }

    
}

export default UserInfo;
