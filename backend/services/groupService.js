import dayjs from "dayjs";
import Subject from "../models/subject.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekOfSubjects.js";
import University from "../models/university.js";
import AcademicGroup from "../models/academicGroup.js";
import User from "../models/user.js";

class GroupService {
    getGroups = async (university) => {
        const _university = await University.findOne({ code: university.toUpperCase() })
        if (!university) return null

        const groups = await AcademicGroup.find({ university: _university._id }, { _id: 0, __v: 0 })
        if (!groups) return null
        return { groups, university: _university }
    }

    getWeekScheduleByGroupId = async (groupId, weekNumber, date, university, user) => {
        const _today = dayjs(date).startOf('week').add(1, 'day')
        const today = _today.format('YYYY-MM-DDTHH:mm:ss')

        const univer = await University.findOne({ code: university.toUpperCase() })
        if (!univer) return null

        const group = await AcademicGroup.findOne({ name: groupId, university: univer._id }, {_id: 0, __v: 0})
        if (!group) return null

        const userFromDb = await User.findOne({ clientId: user })

        let isCreator = false

        const schedule = await Week.findOne({ groupName: group.name, university: univer._id, isEven_: weekNumber % 2 === 0 }, { __v: 0 })
            .populate({
                path: 'days',
                model: 'Day',
                select: {
                    __v: 0
                },
                populate: {
                    path: 'subjects',
                    model: 'Subject',
                    select: {
                        __v: 0
                    },
                }
            }).exec()
        if (schedule) {
            if (userFromDb && schedule.author_id === userFromDb.id) isCreator = true
            console.log('schedule is exists')
            const _schedule = JSON.parse(JSON.stringify(schedule))
            const _days = await Promise.all(_schedule.days.map(day => {
                const _day_t = _today.add(Number(day.dayNumber)-1, 'day').format('YYYY-MM-DDTHH:mm:ss')
                return {...day, date: _day_t}
            }))
            if (isCreator) return {..._schedule, mondayDate: today, days: _days, isCreator: true}
            else return {..._schedule, mondayDate: today, days: _days}
        } else {
            const schedule2 = await Week.findOne({groupName: group.name, university: univer._id}, {__v: 0})
            .populate({
                path: 'days',
                model: 'Day',
                select: {
                    __v: 0
                },
                populate: {
                    path: 'subjects',
                    model: 'Subject',
                    select: {
                        __v: 0
                    },
                }
            }).exec()
            if (schedule2) {
                if (userFromDb && schedule.author_id === userFromDb.id) isCreator = true
                const _schedule = JSON.parse(JSON.stringify(schedule2))
                const _days = await Promise.all(_schedule.days.map(day => {
                    const _day_t = _today.add(Number(day.dayNumber)-1, 'day').format('YYYY-MM-DDTHH:mm:ss')
                    return {...day, date: _day_t}
                }))
                if (isCreator) return {..._schedule, mondayDate: today, days: _days, isCreator: true}
                else return {..._schedule, mondayDate: today, days: _days}
            }
        }
    }
}

export default GroupService