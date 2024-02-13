import {URLS} from "../constants/URLS.js";
import fetch from "node-fetch";
import Subject from "../models/subject.js";
import dayjs from "dayjs";
import Day from "../models/dayModel.js";
import WeekOfSubjects from "../models/weekOfSubjects.js";
import Week from "../models/weekOfSubjects.js";
import AcademicGroup from "../models/academicGroup.js";
import GroupUploadingSchema from "../models/groupUpdating.js";
import GroupUploading from "../models/groupUpdating.js";
import University from "../models/university.js";
import mongoose from "mongoose";
import { createVoenkaDay } from "../utils/voenkaSchedule.js";

const GROUP_URLS = {
    "DSTU": "",
    "RSUE": ""
}

const voenka = "Военная кафедра"

export const DSTU_ID = mongoose.Types.ObjectId('64e097f9d969bf39ffe614be')

class DstuService {
    async fetchGroup(URL, groupId, date) {
        const response = await fetch(URL + groupId + "&sdate=" + (date || dayjs().format('YYYY-MM-DD')));
        return await response.json()
    }

    async adaptToServer (subject, groupID) {

        //if (subject["дисциплина"].includes(voenka)) console.log('voenka')
        try {
            const subj = new Subject({
                audName: subject["аудитория"],
                date: dayjs(subject["дата"]).format('YYYY-MM-DD'),
                startTime: subject["начало"],
                endTime: subject["конец"],
                groupName: subject["группа"],
                groupID: subject["кодГруппы"],
                teacherName: subject["преподаватель"],
                teacherId: subject["кодПреподавателя"],
                year: subject["учебныйГод"],
                isSubgroup: subject["isPodgr"],
                number: subject["номерЗанятия"],
                name: subject["дисциплина"],
                group: groupID,
            })

            await subj.save()
            return subj.id
        } catch (e) {
            console.log(e)
        }
    }

    async createDay(groupName, groupID, date, day) {

        const day_processed = day.flat()
        const filteredSubjects = day_processed.filter(subject => subject !== undefined);

        const dayObject = new Day({
            groupName: groupName,
            groupID: groupID,
            date: date,
            subjects: filteredSubjects
        })
        await dayObject.save()

        return dayObject.id
    }

    async processGroupedSchedule(schedule, info) {
        const groupFromDb = await AcademicGroup.findOne({ groupID: +info.group.groupID, university: DSTU_ID })

        let isVoenkaProcessed = false
        let week = await Promise.all(Object.keys(schedule).map(async date => {
            let day = await Promise.all(schedule[date].map(async subjectArray => {

                const isVoenka = subjectArray[0]["дисциплина"].includes('Военная кафедра')
                if (isVoenka) {
                    // Обработка Военной кафедры
                    if (!isVoenkaProcessed) {
                        isVoenkaProcessed = true;
                        return await createVoenkaDay(subjectArray[0], info.group.name, info.group.groupID, groupFromDb?._id);
                    }
                } else {
                    return await Promise.all(subjectArray.map(async subject => {
                        return await this.adaptToServer(subject, groupFromDb?._id)
                    }))
                }
                // return await Promise.all(subjectArray.map(async subject => {
                //     return await this.adaptToServer(subject, groupFromDb?._id)
                // }))
            }))
            return await this.createDay(info.group.name, info.group.groupID, date, day)
        }))

        const weekObject = new WeekOfSubjects({
            curSem: info.curSem,
            curWeekNumber: info.curWeekNumber,
            dateUploadingRasp: info.dateUploadingRasp,
            groupName: info.group.name,
            groupID: info.group.groupID,
            year: info.year,
            mondayDate: info.date,
            days: week,
            university: DSTU_ID,
            group: groupFromDb?._id
        })

        await this.subscribeToGroup(info.group.groupID)

        await weekObject.save()
        return weekObject.id
    }

    async subscribeToGroup(groupId) {
        const groupFromDb = await GroupUploading.findOne({groupID: groupId})
        if(!groupFromDb) {

            // Находим группу, убираем последнюю цифру, добавляем в список обновляемых групп весь данный поток
            // Уменьшаем нагрузку на бд, так как не храним расписание всех 2к групп, и подгружаем группы потока
            // пользователя (на случай, если главный сайт упадет, люди начнут переходить сюда, где для них будет всё закэшировано)
            const findedGroup = await AcademicGroup.findOne({groupID: groupId})
            if (findedGroup) {
                let groupThread = findedGroup.name.slice(0, -1)
                const allGroupsFromDb = await AcademicGroup.find({name: {$regex: new RegExp(groupThread)}})
                allGroupsFromDb.map(async group => {
                    const findedGroup = await GroupUploading.findOne({ groupId: group.groupID, groupName: group.name })
                    if (!findedGroup) {
                        const newGroup = new GroupUploading({
                            groupID: group.groupID,
                            groupName: group.name
                        })
                        await newGroup.save()
                    }
                })
            }
        }
    }

    async removeWeek(monday) {
        const weeks = await Week.find({ university: DSTU_ID, mondayDate: monday });
        const promises = weeks.map((w) => w.remove());
        return Promise.all(promises)
            .then(() => {
                console.log('Все предметы DSTU этой недели удалены');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async groupSchedule(schedule) {
        let obj = {};
        if (schedule?.data?.rasp) {
            let rasp1 = schedule.data.rasp;
            for (let i = 0; i < rasp1.length; i++) {
                const raspDate = rasp1[i]["дата"].split("T");
                if (obj[raspDate[0]] && obj[raspDate[0]].length > 0) {
                    if (
                        rasp1[i]["номерЗанятия"] === rasp1[i - 1]["номерЗанятия"] &&
                        rasp1[i - 1]["дата"].split("T")[0] === raspDate[0]
                    ) {
                        obj[raspDate[0]][obj[raspDate[0]].length - 1].push({
                            ...rasp1[i],
                            isPodgr: true,
                        });
                    } else {
                        obj[raspDate[0]].push([
                            {
                                ...rasp1[i],
                                isPodgr: false,
                            },
                        ]);
                    }
                } else {
                    obj[raspDate[0]] = [];
                    obj[raspDate[0]].push([
                        {
                            ...rasp1[i],
                            isPodgr: false,
                        },
                    ]);
                }
            }
            return await this.processGroupedSchedule(obj, schedule.data.info)
        }
        else {
            console.log('in else')
            return null
        }
    }

    async safetyUpdateSchedule() {
        const _date = new Date()
        try {
            getWeekIdScheduleFromServer(50896, _date)
        } catch (e) {
            
        }
    }

    async getWeekIdScheduleFromServer(groupId, date) {
        try {
            return await this.fetchGroup(URLS.GET_GROUP_SCHEDULE, groupId, date).then(async res => {
                return await this.groupSchedule(res)
            })
        } catch (e) {
            console.log('groupId', e)
            return null
        }
    }

    async getWeekScheduleByGroupId(group_id) {
        return Week.findOne({groupID: group_id}, {__v: 0}).populate({
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
    }

    async getWeekScheduleById(week_id) {
        return Week.findById(week_id, {__v: 0}).populate({
            path: 'days',
            model: 'Day',
            select: {
                __v: 0,
                _id: 0
            },
            populate: {
                path: 'subjects',
                model: 'Subject',
                select: {
                    __v: 0
                },
            }
        })
    }

    async getWeekScheduleByGroupIdAndDate(group_id, date) {
        const monday = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')

        return Week.findOne({groupID: group_id, mondayDate: monday}, {__v: 0}).populate({
            path: 'days',
            model: 'Day',
            select: {
                __v: 0,
                _id: 0
            },
            populate: {
                path: 'subjects',
                model: 'Subject',
                select: {
                    __v: 0
                },
            }
        })
    }

    async getGroupsFromServer() {
        const response = await fetch(URLS.GET_GROUPS)
        const data = await response.json()
        return Promise.all(data.data.map(async obj => {
            const group = new AcademicGroup({
                faculty: obj.facul,
                name: obj.name,
                level: Number.parseInt(obj.kurs),
                university: DSTU_ID,
                groupID: obj.id
            })
            await group.save()
        }))
    }

    async getGroups() {
        const groupsFromDb = await AcademicGroup.find({university: DSTU_ID}, { __v: 0})
        if (groupsFromDb.length > 0) return groupsFromDb
        else return await this.getGroupsFromServer()
    }

    async getTeacherSchedule(teacherName, date) {
        const monday = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')

        const subjects = await Subject.find({teacherName, date: monday})
        console.log(subjects)
    }
}

export default DstuService