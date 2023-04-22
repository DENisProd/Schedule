import {Schema, model, ObjectId} from "mongoose"

const weekSchema = new Schema({
    curSem: {type: Number},
    curWeekNumber: {type: Number},
    dateUploadingRasp: {type: Date, default: Date.now()},
    groupName: {type: String},
    groupID: {type: Number},
    year: {type: String},
    days: [{type: ObjectId, ref: 'Day', required: true}],
    mondayDate: {type: String}
})

const Week = model("Week", weekSchema)

export default Week