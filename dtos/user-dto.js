module.exports = class UserDto {
    id;
    username;
    name;
    options;
    token;

    constructor(model) {
	this.id = model.id;
	this.username = model.username;
	this.name = model.name;
	this.options = model.options;
	this.token = model.token;
    }
}