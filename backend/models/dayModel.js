import mongoose, {Schema, model, ObjectId} from "mongoose"

const daySchema = new Schema({
    dateUploadingRasp: {type: Date, default: Date.now()},
    groupName: {type: String},
    groupID: {type: Number},
    date: {type: Date},
    subjects: [{type: ObjectId, ref: 'Subject', required: true}],
    dayNumber: {type: String}
})

daySchema.pre('remove', function (next) {
    const childIds = this.subjects.map((child) => child._id);
    // Удаляем связанные документы
    mongoose.model('Subject').deleteMany({ _id: { $in: childIds } }, (err) => {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
});

const Day = model("Day", daySchema)

export default Day