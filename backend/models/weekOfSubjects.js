import mongoose, {Schema, model, ObjectId} from "mongoose"

const weekSchema = new Schema({
    curSem: {type: Number},
    curWeekNumber: {type: Number},
    dateUploadingRasp: {type: Date, default: Date.now()},
    dateUploadingRaspDark: {type: Date, default: Date.now()},
    groupName: {type: String},
    groupID: {type: String},
    group: {type: ObjectId, ref: 'AcademicGroup', required: true},
    year: {type: String},
    days: [{type: ObjectId, ref: 'Day', required: true}],
    mondayDate: {type: String},
    isEven_: {type: Boolean, default: false},
    university: {type: ObjectId, ref: 'University', required: true},
    faculty: {type: String},
    author_id: {type: String, default: 'admin'},
})

weekSchema.pre('remove', function (next) {
    const childIds = this.days.map((child) => child._id);
    // Удаляем связанные документы
    mongoose.model('Day').deleteMany({ _id: { $in: childIds } }, (err) => {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
});

const Week = model("Week", weekSchema)

export default Week