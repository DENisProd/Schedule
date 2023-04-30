import {Schema, model, ObjectId} from "mongoose"

const subjectSchema = new Schema({
    audName: {type: String},
    date: {type: Date},
    startTime: {type: String},
    endTime: {type: String},
    groupName: {type: String},
    groupID: {type: Number},
    dateUploadingRasp: {type: Date, default: Date.now()},
    teacherName: {type: String},
    teacherId: {type: Number},
    year: {type: String},
    isSubgroup: {type: Boolean, default: false},
    number: {type: Number, default: 1},
    name: {type: String}
})

const Subject = model("Subject", subjectSchema)

export default Subject