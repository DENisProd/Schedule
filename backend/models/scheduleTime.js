import {Schema, model, ObjectId} from "mongoose"

const scheduleTimeSchema = new Schema({
    author_id: String,
    timeStart: String,
    timeEnd: String,
    number: Number,
    university: {type: ObjectId, ref: 'University', required: true},
    created_at: {type: Date, default: Date.now()}
})

export default model("SheduleTime", scheduleTimeSchema)