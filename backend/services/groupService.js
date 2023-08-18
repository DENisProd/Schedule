import dayjs from "dayjs";
import Subject from "../models/subject.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekOfSubjects.js";
import University from "../models/university.js";
import AcademicGroup from "../models/academicGroup.js";

class GroupService {
    getGroups = async (university) => {
        const _university = await University.findOne({ code: university.toUpperCase() })
        if (!university) return null

        const groups = await AcademicGroup.find({university: _university._id}, {_id: 0, __v: 0}).populate('university').exec()
        if (!groups) return null
        return {groups, university: _university}
    }

    getWeekScheduleByGroupId = async (groupId, weekNumber, date, university) => {
        const _today = dayjs(date).startOf('week').add(1, 'day')
        const today = _today.format('YYYY-MM-DDTHH:mm:ss')

        const univer = await University.findOne({ code: university.toUpperCase() })
        if (!univer) return null

        const group = await AcademicGroup.findOne({ name: groupId }, {_id: 0, __v: 0})
        if (!group) return null

        const schedule = await Week.findOne({groupName: group.name, university: univer._id, isEven_: weekNumber % 2 === 0}, {__v: 0})
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
            })
        if (schedule) {
            console.log('schedule is exists')
            const _schedule = JSON.parse(JSON.stringify(schedule))
            console.log(_schedule.days)
            const _days = await Promise.all(_schedule.days.map(day => {
                const _day_t = _today.add(Number(day.dayNumber)-1, 'day').format('YYYY-MM-DDTHH:mm:ss')
                return {...day, date: _day_t}
            }))
            return {..._schedule, mondayDate: today, days: _days}
        } else return null
    }
}

export default GroupService