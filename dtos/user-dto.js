module.exports = class UserDto {
    id;
    username;
    name;
    options;
    balance;
    token;
    ref_code;
    refs;
    refs_count;

    constructor(model) {
	this.id = model.id;
	this.username = model.username;
	this.name = model.name;
	this.options = model.options;
	this.balance = model.balance;
	this.token = model.token;
	this.ref_code = model.ref_code;
	this.refs_count = model.refs.length;
    }
}