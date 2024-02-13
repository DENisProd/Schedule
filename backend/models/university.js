import {Schema, model, ObjectId} from "mongoose"

const universitySchema = new Schema({
    full_name: {type: String, required: true},
    short_name: {type: String, required: true},
    city: String,
    type: String,
    is_moderated: Boolean,
    author_id: {type: String, required: true},
    created_at: Date,
    code: String,
    url: String
})

const University = model('University', universitySchema)

export default University