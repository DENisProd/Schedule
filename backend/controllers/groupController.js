import DstuService from "../services/dstuService.js"
import {UNIVERSITIES} from "../constants/Universities.js";
import RsueService from "../services/rsueService.js";
import dayjs from "dayjs";
import University from "../models/university.js";
import AcademicGroup from "../models/academicGroup.js";
import Subject from "../models/subject.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekOfSubjects.js";
import GroupService from "../services/groupService.js";
import User from "../models/user.js";

const dstuService = new DstuService()
const rsueService = new RsueService()
const groupService = new GroupService()

const DAY_NAMES = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7
}

Date.prototype.getWeek = function () {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const daysSinceFirstDayOfYear = (this - firstDayOfYear) / 86400000;
    return Math.ceil((daysSinceFirstDayOfYear + firstDayOfYear.getDay() + 1) / 7);
};
const _getOneById = async (groupId, university, date, user) => {
    try {
        if (groupId) {
            switch (university.toUpperCase()) {
                case UNIVERSITIES.DSTU: {
                    const week = await dstuService.getWeekScheduleByGroupIdAndDate(groupId, date)

                    if (week) {
                        console.log("is exists in db")
                        return {week}
                    } else {
                        console.log("not exists in db")
                        const week_id = await dstuService.getWeekIdScheduleFromServer(groupId, date)
                        // console.log(week_id)

                        if (week_id) {
                            const weekSchedule = await dstuService.getWeekScheduleById(week_id)
                            return {week: weekSchedule}
                        } else
                            return 404

                    }
                    break
                }
                case UNIVERSITIES.DGTU: {
                    const week = await dstuService.getWeekScheduleByGroupIdAndDate(groupId, date)

                    if (week) {
                        console.log("is exists in db")
                        return {week}
                    } else {
                        console.log("not exists in db")
                        const week_id = await dstuService.getWeekIdScheduleFromServer(groupId, date)
                        // console.log(week_id)

                        if (week_id) {
                            const weekSchedule = await dstuService.getWeekScheduleById(week_id)
                            return {week: weekSchedule}
                        } else
                            return 404

                    }
                    break
                }
                case UNIVERSITIES.RSUE: {
                    // getWeekScheduleByGroupId
                    //const schedule = await rsueService.parseSchedule(3,3,2)
                    const _date = new Date(date)
                    const weekNumber = Number.parseInt(_date.getWeek())

                    const sch = await rsueService
                        // .getSchedule(weekNumber % 2 === 0 ? schedule[1] : schedule[0], groupId)
                        .getWeekScheduleByGroupId(groupId, weekNumber, date)  
                    if (sch)
                        return {week: sch}
                    else
                        return 404
                }
                case UNIVERSITIES.RGEU: {
                    // getWeekScheduleByGroupId
                    //const schedule = await rsueService.parseSchedule(3,3,2)
                    const _date = new Date(date)
                    const weekNumber = Number.parseInt(_date.getWeek())

                    const sch = await rsueService
                        // .getSchedule(weekNumber % 2 === 0 ? schedule[1] : schedule[0], groupId)
                        .getWeekScheduleByGroupId(groupId, weekNumber, date)

                    if (sch)
                        return {week: sch}
                    else
                        return 404
                }
                default:
                    const _date = new Date(date)
                    const weekNumber = Number.parseInt(_date.getWeek())

                    const sch = await groupService.getWeekScheduleByGroupId(groupId, weekNumber, date, university, user)

                    if (sch)
                        return {week: sch}
                    else
                        return 404
            }
        }

    } catch (e) {
        console.log(e)
        return 500
    }
}

class groupController {

    async getOneById(groupId, university, date, user) {
        return _getOneById(groupId, university, date, user)
    }

    async getCompare(req, res) {
        console.log('compare groups')
        try {
            const {groups} = req.body
            let {date} = req.params

            if (!groups || !(groups && groups.length > 0)) return res.status(400).json({message: 'вы не добавили группы в сравнение'})

            if (!date) date = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')

            let schedule = await Promise.all(
                groups.map(async group => {
                    const data = await _getOneById(group.id, group.univer, date)
                    return data.week
                })
            )
            res.json(schedule)

        } catch (e) {
            res.status(500).json({message: 'произошла ошибка при получении расписания ваших групп'})
        }
    }

    async getAllForUniversity(req, res) {
        try {
            const university = req.params.univer.toString().toUpperCase()
            console.log(university)
            if (university) {

                switch (university) {
                    case UNIVERSITIES.DSTU: {
                        console.log('dstu')
                        const response = await dstuService.getGroups()
                        res.status(200).json(response)
                        break
                    }
                    case UNIVERSITIES.DGTU: {
                        console.log('dgtu')
                        const response = await dstuService.getGroups()
                        res.status(200).json(response)
                        break
                    }
                    case UNIVERSITIES.RSUE: {
                        const response = await rsueService.getGroups()
                        res.status(200).json(response)
                        break
                    }
                    case UNIVERSITIES.RGEU: {
                        const response = await rsueService.getGroups()
                        res.status(200).json(response)
                        break
                    }
                    default: {
                        const response = await groupService.getGroups(university)
                        if (!response) res.status(400).json({ message: 'Произошла ошибка при получении группы'})
                        res.status(200).json(response)
                    }
                }
            } else {
                return res.status(404).json({message: "Учебное заведение не найдено"})
            }

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Ошибка при получении групп"})
        }
    }

    createSchedule = async (req, res) => {
        try {
            const {groupId, universityId, isEven_, days, author_id} = req.body

            const university = await University.findById(universityId)
            if (!university) return res.status(404).json({message: 'Учебное заведение не найдено'})

            const group = await AcademicGroup.findById(groupId)
            if (!group) return res.status(404).json({message: 'Группа не найдена'})

            const userFromDb = await User.findOne({ clientId: author_id })
            if (!userFromDb) return res.status(404).json({ isError: true, message: 'Пользователь не найден' })

            const monday = dayjs().startOf('week').add(1, 'day')
            //.format('YYYY-MM-DDTHH:mm:ss')

            let arr = []
            await Promise.all(Object.keys(days).map(async day => {
                    if (!Array.isArray(days[day])) return res.status(400).json({message: 'Расписание не должно быть пустым'})
                    const _day = await Promise.all(
                        days[day].map(async subject => {
                            const _subject = new Subject({
                                date: monday.add(DAY_NAMES[day], 'day').format('YYYY-MM-DDTHH:mm:ss'),
                                groupName: group.name,
                                startTime: subject.timeStart.trim(),
                                endTime: subject.endTime.trim(),
                                name: subject.name + (subject.isSubgroup ? (' п/г ' + subject.name) : ''),
                                teacherName: subject.teacherName,
                                audName: subject.audName,
                                type: subject.type,
                                year: monday.year(),
                                number: subject.number,
                                isSubgroup: subject.isSubgroup,
                                group: group._id,
                            })
                            await _subject.save()
                            return _subject._id
                        })
                    )
                    const dayObject = new Day({
                        dayNumber: DAY_NAMES[day],
                        subjects: _day,
                        groupName: group.name,
                        date: monday.add(DAY_NAMES[day], 'day').format('YYYY-MM-DDTHH:mm:ss')
                    })
                    await dayObject.save()
                    arr.push(dayObject.id)
                }
            ))
            const _week = new Week({
                isEven_: isEven_,
                days: arr,
                year: new Date().getFullYear(),
                groupName: group.name,
                curWeekNumber: 1,
                groupID: group.name,
                university: universityId,
                faculty: group.faculty,
                group: group._id,
                author_id: userFromDb._id
            })
            await _week.save()

            return res.status(201).json({ message: 'Расписание недели создано.'})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }
}


export default groupController