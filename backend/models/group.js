const {Schema, model, ObjectId} = require("mongoose")

const groupInfo = new Schema({
    aud: {
        name: {type: String}
    },
    curSem: {type: Number},
    curWeekNumber: {type: Number},
    date: {type: Date},
    dateUploadingRasp: {type: Date},
    group: {
        name: {type: String}, 
        groupID: {type: Number}
    },
    kafedra: {
        name: {type: String}
    },
    lastDate: {type: Date},
    prepod: {
        name: {type: String}
    },
    year: {type: String}
})

module.exports = model("GroupInfo", groupInfo)