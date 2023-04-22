import {Schema, model, ObjectId} from "mongoose"

const groupSchema = new Schema({
    audName: {type: String},
    audId: {type: Number},
    curSem: {type: Number},
    curWeekNumber: {type: Number},
    date: {type: Date},
    dateUploadingRasp: {type: Date},
    groupName: {type: String},
    groupID: {type: Number},
    department: {
        name: {type: String}
    },
    lastDate: {type: Date},
    teacherName: {type: String},
    teacherId: {type: Number},
    year: {type: String},
    isSubgroup: {type: Boolean, default: false},
    schedule: {type: ObjectId, ref: 'User', required: true},
})

const Group = model("Group", groupSchema)

export default Group