module.exports = class SettingDto {
    key;
    value;

    constructor(model) {
	this.key = model.key;
	this.value = model.value;
    }
}