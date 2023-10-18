module.exports = class UserDto {
    id;
    username;
    name;
    status;
    options;
    balance;
    token;
    demo_time;
    ref_code;
    refs;
    refs_count;

    constructor(model) {
	this.id = model.id;
	this.username = model.username;
	this.name = model.name;
	this.status = model.status;
	this.options = model.options;
	this.balance = model.balance;
	this.token = model.token;
	this.demo_time = model.demo_time;
	this.ref_code = model.ref_code;
	this.refs_count = model.refs?.length;
    }
}