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
	console.log("In here");	
	if (userList[req.session.id] === undefined) {
		console.log("In removeUserFromAuthList");
		res.status(403).send('user does not exist');
	} else {
		console.log("In removeUserFromAuthList");						
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

module.exports = {userAuthentication, addUserToAuthList, removeUserFromAuthList, getUserInfo, getAllUsers}
