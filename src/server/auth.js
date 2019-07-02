const gameRoomsComp = require('./gameRooms');
const userList = {};

function userAuthentication(req, res, next) {		
	if (userList[req.session.id] === undefined) {				
		res.sendStatus(401);		
	} else {		
		next();
	}
}

function addUserToAuthList(req, res, next) {	
	if (userList[req.session.id] !== undefined) {
		res.status(403).send('user already exist');
	} else {		
		for (sessionid in userList) {
			const name = userList[sessionid];
			if (name === req.body) {
				res.status(403).send('user name already exist');
				return;
			}
		}		
		userList[req.session.id] = req.body;
		next();
	}
}

function removeUserFromAuthList(req, res, next) {	
	if (userList[req.session.id] === undefined) {
		res.status(403).send('user does not exist');
	} else {					
		delete userList[req.session.id];
		next();
	}
}

function getUserInfo(id) {	
    return {name: userList[id]};
}

function getAllUsers(){
	let userNameList = []
	let index = 0;
	for (let [key, value] of Object.entries(userList)) {
		userNameList[index] = value;
		index = index + 1;
	  }
	return userNameList;
}
function logout(req, res, next){
	let ans = gameRoomsComp.quitGame(getUserInfo(req.session.id).name, req.body);
    if(!ans){
        res.status(403).send('you can not quit the game now');
        return false;
    }
    else{
		removeUserFromAuthList(req, res, next);
    }
}
function quit(req, res, next){
	let ans = gameRoomsComp.quitGame(getUserInfo(req.session.id).name, req.body);
    if(!ans){
        res.status(403).send('you can not quit the game now');
        return false;
    }
	next();
}



module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, getAllUsers, logout, quit}
