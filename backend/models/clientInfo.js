const {Schema, model, ObjectId} = require("mongoose")

const clientInfo = new Schema({
    userAgent: {type: String},
    ipAdress: {type: String},
    searchedGroups: [{type: String}],
    favoriteGroups: [{type: String}],
    enterCount: {type: Number},
    created: {type: Date, default: Date.now}
})

module.exports = model("ClientInfo", clientInfo)