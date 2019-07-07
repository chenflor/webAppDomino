const express = require('express');
const router = express.Router();
const gameBoards = require('./gameBoards');
const gameRooms = require('./gameRooms');
const auth = require('./auth');


const gameBoardsManagement = express.Router();

gameBoardsManagement.get('/getGameBoard',(req, res) => {
    let gameName = gameRooms.findGameNameByPlayer(auth.getUserInfo(req.session.id).name);
    if(gameName){
        
        res.json(gameBoards.getGameBoard(gameName));	
    }
    else{
        res.status(404).send("user not in game");
    }	
});
gameBoardsManagement.get('/isItMyTurn',(req, res) => {
    let playerName = auth.getUserInfo(req.session.id).name;
    let gameName = gameRooms.findGameNameByPlayer(playerName);
    if(gameName){
        let isItMyTurn = gameBoards.getGameBoard(gameName).currentPlayerTurn == playerName;
        res.json({isItMyTurn : isItMyTurn});
    }
    else{ 
        console.warn("called isItMyTurn without being in a game");
        res.json({isItMyTurn :false });

    }
});

gameBoardsManagement.post('/insertDomino',(req, res) => {
    let gameName = gameRooms.findGameNameByPlayer(auth.getUserInfo(req.session.id).name);
    if(gameName){
       if(gameBoards.insertDominoToGameBoard(JSON.parse(req.body), gameName)){
            res.sendStatus(200);
       }
       else{
            res.sendStatus(403);
       }	
    }
    else{
        res.status(404).send("user not in game");
    }	
});




module.exports = gameBoardsManagement;
