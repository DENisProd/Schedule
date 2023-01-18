import {Schema, model, ObjectId} from "mongoose"

const clientInfo = new Schema({
    userAgent: {type: String},
    ipAdress: {type: String},
    searchedGroups: [{type: String}],
    favoriteGroups: [{type: String}]
})

const ClientInfo = model("ClientInfo", clientInfo)
export default ClientInfo