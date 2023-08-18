import {Schema, model, ObjectId} from "mongoose"

const queueSchema = new Schema({
    group: {type: ObjectId, ref: 'AcademicGroup', required: true},
    subject: {type: ObjectId, ref: 'Subject', required: true},
    author: {type: ObjectId, ref: 'User', required: true},
    startTime: {type: Date, required: true},
    members: [{
        name: {type: String},
        userUUID: {type: String},
        number: {type: Number}
    }],
    subscribers: [{
        name: {type: String},
        userUUID: {type: String}
    }]
})

const Queue = model("Queue", queueSchema)

export default Queue