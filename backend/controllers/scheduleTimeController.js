import University from "../models/university.js";
import User from "../models/user.js";
import ScheduleTime from "../models/scheduleTime.js";
import mongoose from "mongoose";

class ScheduleTimeController {
    create = async (req, res) => {
        try {
            const universityFromDb = await University.findById(req.body.university)

            if (universityFromDb) {
                const userFromDb = await User.findOne({clientId: req.body.author_id})

                if (userFromDb) {
                    // TODO добавить проверку на валидность времени
                    const scheduleEntries = req.body.schedule.map((entry) => ({
                        author_id: req.body.author_id,
                        timeStart: entry.startTime,
                        timeEnd: entry.endTime,
                        number: entry.number,
                        university: universityFromDb._id,
                    }));

                    await ScheduleTime.insertMany(scheduleEntries);

                    return res.status(201).json({message: 'Расписание звонков успешно создано', schedule: scheduleEntries})
                }
            }
            return res.status(404).json({message: 'Учебное заведение не найдено'})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Произошла ошибка при создании расписания звонков'})
        }
    }

    getAllByUniversity = async (req, res) => {
        try {
            const univer = await University.findById(req.params.univerId)

            if (univer) {
                const times = await ScheduleTime.find({ university: mongoose.Types.ObjectId(req.params.univerId)})
                return res.status(200).json(times)
            }
            return res.status(404).json({message: 'Учебное заведение не найдено'})
        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при получении расписания звонков'})
        }
    }

    update = async (req, res) => {
        try {

        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при создании расписания звонков'})
        }
    }

    delete = async (req, res) => {
        try {

        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при создании расписания звонков'})
        }
    }
}

export default ScheduleTimeController

function getDateFromTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);

    const currentTime = new Date();
    currentTime.setHours(hours);
    currentTime.setMinutes(minutes);

    return currentTime
}