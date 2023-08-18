import {Schema, model, ObjectId} from "mongoose"

const userSchema = new Schema({
    clientId: { type: String, unique: true },
    ip: String,
    userAgent: String,
    language: String,
    geolocation: String,
    screenResolution: String,
    deviceType: String,
    browser: String,
    os: String,
    referer: String,
    authorized: Boolean, // Поле, которое будет отражать согласие пользователя на сбор данных
    favoriteGroups: [{type: String}],
    searchedGroups: [{type: String}],
    created: {type: Date, default: Date.now()},
    group: String,
    enterCount: Number,
    mapCounts: Number
})

export default model("User", userSchema)