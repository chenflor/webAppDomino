const express = require('express');
const router = express.Router();
const gameBoards = require('./gameBoards');
const gameRooms = require('./gameRooms');
const auth = require('./auth');


const gameBoardsManagement = express.Router();

gameBoardsManagement.get('/getGameBoard',(req, res) => {
    let gameName = gameRooms.findGameNameByPlayer(auth.getUserInfo(req.session.id).name);
    console.log(gameName);
    if(gameName){
        res.json(gameBoards.getGameBoard(gameName));	
    }
    else{
        res.status(404).send("user not in game");
    }	
});




module.exports = gameBoardsManagement;
