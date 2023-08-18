import {Schema, model, ObjectId} from "mongoose"

const academicGroup = new Schema({
    faculty: {type: String},
    groupID: {type: Number},
    name: {type: String},
    university: {type: ObjectId, ref: 'University', required: true},
    level: {type: Number}
})

const AcademicGroup = model("AcademicGroup", academicGroup)

export default AcademicGroup