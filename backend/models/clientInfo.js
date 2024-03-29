import {Schema, model, ObjectId} from "mongoose"

const clientInfoSchema = new Schema({
    userAgent: {type: String},
    ipAdress: {type: String},
    group: {type: String},
    searchedGroups: [{type: String}],
    favoriteGroups: [{type: String}],
    enterCount: {type: Number},
    created: {type: Date, default: Date.now}
})

const ClientInfo = model("ClientInfo", clientInfoSchema)

export default ClientInfo