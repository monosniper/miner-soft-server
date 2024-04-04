const SettingModel = require('../models/setting-model')
const SettingDto = require('../dtos/setting-dto')

class SettingController {
    async index(req, res, next) {
        const settings = await SettingModel.findAll()
        return res.json(settings.map(setting => new SettingDto(setting)))
    }

    async update(req, res, next) {
        Object.entries(req.body).forEach(([key, value]) => {
            SettingModel.update({value}, {where: {key}})
        })

        return res.json({success: true});
    }
}

module.exports = new SettingController();