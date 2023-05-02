import {Schema, model, ObjectId} from "mongoose"

const academicGroup = new Schema({
    faculty: {type: String},
    groupID: {type: Number},
    name: {type: String},
    university: {type: String},
    level: {type: Number}
})

const AcademicGroup = model("AcademicGroup", academicGroup)

export default AcademicGroup