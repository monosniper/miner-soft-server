module.exports = class UserDto {
    id;
    username;
    name;
    options;

    constructor(model) {
	this.id = model.id;
	this.username = model.username;
	this.name = model.name;
	this.options = model.options;
    }
}