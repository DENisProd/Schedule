import {Schema, model, ObjectId} from "mongoose"

const groupUploadingSchema = new Schema({
    dateUploadingRaspDark: {type: Date, default: Date.now()},
    groupID: {type: Number},
})

const GroupUploading = model("GroupUploading", groupUploadingSchema)

export default GroupUploading