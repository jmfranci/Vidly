function isMongoIdValid(id){
	if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
	else return false;
}

module.exports.isMongoIdValid = isMongoIdValid;