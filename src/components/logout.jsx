import React from 'react';

const Logout =(props) =>{
    // console.log(props);
    // console.log("Logout render");
    return (<button className="logout btn" onClick={props.logoutHandler}>Logout</button>)
};

export default Logout