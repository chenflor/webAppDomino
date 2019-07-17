const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userManagement = require('./server/userManagement');
const gamesManagement = require('./server/gamesManagement');
const gameRoomsManagement = require('./server/gameRoomsManagement');
const gameBoardsManagement = require('./server/gameBoardsMangement');

const app = express();

app.use(session({ secret: 'keyboard cat', cookie: {maxAge:269999999999}}));
app.use(bodyParser.text());

app.use(express.static(path.resolve(__dirname, "..", "public")));


app.use('/users', userManagement);
app.use('/games', gamesManagement);
app.use('/gameRooms', gameRoomsManagement);
app.use('/gameBoards', gameBoardsManagement);

app.listen(3000, console.log('Example app listening on port 3000!'));