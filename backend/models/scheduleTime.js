import {Schema, model, ObjectId} from "mongoose"

const scheduleTimeSchema = new Schema({
    times: [{
        timeStart: String,
        timeEnd: String,
        number: Number
    }],
    university: {type: ObjectId, ref: 'University', required: true},
    created_at: {type: Date, default: Date.now()},
    author_id: {type: String, required: true},
})

export default model("SheduleTime", scheduleTimeSchema)