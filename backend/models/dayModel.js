import {Schema, model, ObjectId} from "mongoose"

const daySchema = new Schema({
    dateUploadingRasp: {type: Date, default: Date.now()},
    groupName: {type: String},
    groupID: {type: Number},
    date: {type: Date},
    subjects: [{type: ObjectId, ref: 'Subject', required: true}],
    dayNumber: {type: String}
})

const Day = model("Day", daySchema)

export default Day