import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import Subject from "../models/subject.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekOfSubjects.js";
import {BASE_URL_RSUE} from "../constants/URLS.js";
import AcademicGroup from "../models/academicGroup.js";
import {FormData} from "formdata-node"
import dayjs from "dayjs";
import mongoose from "mongoose";
import https from "https";

const subjectNumbers = {
    "8:30": 1,
    "10:10": 2,
    "11:50": 3,
    "13:50": 4,
    "15:30": 5
}

const daysOfWeek = {
    "Понедельник": 1,
    "Вторник": 2,
    "Среда": 3,
    "Четверг": 4,
    "Пятница": 5,
    "Суббота": 6,
    "Воскресенье": 7,
}

const faculties = {
    1: "Менеджмент и предпринимательство",
    2: "Торговое дело",
    3: "Компьютерные технологии и информационная безопасность",
    4: "Учетно-экономический",
    5: "Экономика и финансы",
    6: "Юридический",
    7: "Лингвистика и журналистика",
}

const shortFaculties = {
    1: "МиП",
    2: "ТД",
    3: "КТиИБ",
    4: "УэФ",
    5: "ФЭиФинансы",
    6: "Юридический",
    7: "ФЛиЖ",
}


export const RSUE_ID = mongoose.Types.ObjectId('64e098eb62ae508c1f674171')

class RsueService {
    async fetchRsue(type, facultyId, courseId) {
        const formData = new FormData();
        formData.append('query', type);
        formData.append('type_id', facultyId);
        if (courseId)formData.append('kind_id', courseId);

        const options = {
            method: 'POST',
            body: formData,
            agent: new https.Agent({ rejectUnauthorized: false })
        }

        const response = await fetch(BASE_URL_RSUE, options)
        const compressedData = await response.arrayBuffer();
        const decoder = new TextDecoder()
        const str = decoder.decode(compressedData)
        return JSON.parse(str)
    }

    async fetchGroups(courseId, facultyId) {


        return await fetch('https://rsue.ru/raspisanie/', options)
    }

    concatArrayOfArray(array) {
        return array.reduce((accumulator, currentValue) => {
            return accumulator.concat(currentValue);
        }, []);
    }

    async getGroupsFromServer() {
        console.log('from server rsue')
        return await Promise.all(Object.keys(faculties).map(async faculty => {
            const response = await this.fetchRsue('getKinds', faculty)
            if (response) {
                let data = await Promise.all(response.map(async resp => {
                    const response2 = await this.fetchRsue('getCategories', faculty, resp.kind_id)
                    // let groups2 = []
                    response2.map(async obj => {
                        const groupFromDb = await AcademicGroup.findOne({ name: obj.category, university: RSUE_ID})
                        if (!groupFromDb) {
                            const group = new AcademicGroup({
                                faculty: shortFaculties[faculty],
                                groupID: Number(obj.category_id),
                                name: obj.category,
                                level: Number.parseInt(resp.kind_id),
                                university: RSUE_ID
                            })
                            await group.save()
                        }
                    })
                    // return groups2
                }))

                // return this.concatArrayOfArray(data)

            }
        }))
    }

    async getGroups() {
        const schedule = await AcademicGroup.find({university: RSUE_ID}, { __v: 0})
        if (schedule.length > 0) return schedule
        else return await this.getGroupsFromServer()
    }

    uuid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    async processSchedule(schedule, mode, groupName, groupId) {
        let arr = []
        for (const e of schedule) {
            const cont = cheerio.load(e)
            const dayName = cont('div').children().first().text()
            const subjects = []
            const subjectsHtml = cont('div').children().first().nextAll().toArray()

            let subgroups = {}
            for (const subj of subjectsHtml) {
                const shtml = cheerio.load(subj)
                const bottomBlock = shtml('div').children()
                let year = new Date()
                let time = shtml('div').children().first().children('span').text()
                let timeArray = time.split('—')
                let podgr = shtml('div').children().first().children('span').children('span').text()
                const name = shtml('div').children().first().next().children('span').text()
                let isSubgroup = false

                if (podgr && subgroups[timeArray[0]])
                    if (Number.parseInt(podgr.replace(/[^0-9\.]/g, '')) !== 1)
                        isSubgroup = true

                subgroups[timeArray[0]] = name
                let subText = timeArray[1].split(' ')[3]

                const _subject = new Subject({
                    groupName,
                    startTime: timeArray[0].trim(),
                    endTime: timeArray[1].split(' ')[1],
                    name: name + (subText ? (' п/г ' + subText) : ''),
                    teacherName: shtml('div').children().first().next().next().children('span').text(),
                    audName: bottomBlock.children('.aud').text(),
                    type: bottomBlock.children('.type').text(),
                    year: year.getFullYear(),
                    number: subjectNumbers[timeArray[0].trim()],
                    group: groupId,
                    isSubgroup,
                })

                await _subject.save()
                subjects.push(_subject.id)
            }

            const day = new Day({
                dayNumber: daysOfWeek[dayName],
                subjects,
                groupName
            })

            await day.save()

            arr.push(day.id)
        }
        return arr
    }

    async removeWeek() {
        const weeks = await Week.find({ university: RSUE_ID });
        const promises = weeks.map((w) => w.remove());
        return Promise.all(promises)
            .then(() => {
                console.log('Все предметы RSUE удалены');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async getAllSchedule() {
            const groups = await AcademicGroup.find({university: RSUE_ID})
            return Promise.all(groups.map(async group => {
                await this.parseSchedule(group.groupID, group.faculty, group)
            }))
    }

    async parseSchedule(facultyId, kursId, groupId, group) {
        const formData = new FormData();
        formData.append('f', facultyId);
        formData.append('k', kursId);
        let grgrgr = groupId
        formData.append('g', grgrgr);
        formData.append('uuid', this.uuid(groupId));

        const options = {
            method: 'POST',
            body: formData,
            agent: new https.Agent({ rejectUnauthorized: false })
        }

        return await fetch('https://rsue.ru/raspisanie/', options)
            .then(res => res.text())
            .then(async data => {
                const $ = cheerio.load(data);
                const container = $('.container').last()
                const groupName = container.find('h1').first().text().replace('Группа ', '')
                const oddWeekArray = container.find('.row').first().children().toArray()
                const evenWeekArray = container.children('.row').last().children().toArray()

                const oddProcessed = await this.processSchedule(oddWeekArray, 'odd', groupName, group._id)
                const evenProcessed = await this.processSchedule(evenWeekArray, 'even', groupName, group._id)

                const oddWeek = new Week({
                    isEven_: false,
                    days: oddProcessed,
                    year: new Date().getFullYear(),
                    groupName,
                    curWeekNumber: 1,
                    groupID: groupName,
                    university: RSUE_ID,
                    faculty: shortFaculties[facultyId],
                    group: group._id
                })

                await oddWeek.save()
                // console.log(oddWeek)

                const evenWeek = new Week({
                    isEven_: true,
                    days: evenProcessed,
                    year: new Date().getFullYear(),
                    groupName,
                    curWeekNumber: 2,
                    university: RSUE_ID,
                    groupID: groupName,
                    faculty: shortFaculties[facultyId],
                    group: group._id
                })

                await evenWeek.save()
                // console.log(evenWeek)

                return {oddId: oddWeek.id, evenId: evenWeek.id}
            })
    }

    async getSchedule(weekNumber, groupName) {
        // return Week.findOne({groupName: groupName, isEven_: weekNumber % 2 === 0, university: 'rsue'})
        const schedule = await Week.findOne({university: RSUE_ID, isEven_: weekNumber % 2 === 0, groupName: groupName})
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
            return schedule
    }

    async getWeekScheduleByGroupId(groupName, weekNumber, date) {
        const _today = dayjs(date).startOf('week').add(1, 'day')
        const today = _today.format('YYYY-MM-DDTHH:mm:ss')
        // console.log('groupName',groupName)
        const schedule = await Week.findOne({
            groupName: groupName,
            university: RSUE_ID,
            isEven_: weekNumber % 2 === 0
        }, {__v: 0})
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
            // console.log('schedule', schedule)
        if (schedule) {
            console.log('schedule is exists')
            const _schedule = JSON.parse(JSON.stringify(schedule))
            const _days = await Promise.all(_schedule.days.map(day => {
                const _day_t = _today.add(Number(day.dayNumber) - 1, 'day').format('YYYY-MM-DDTHH:mm:ss')
                return {...day, date: _day_t}
            }))
            return {..._schedule, mondayDate: today, days: _days}


        } else {
            console.log('schedule is not exists')
            const group = await AcademicGroup.findOne({name: groupName, university: RSUE_ID})
            if (group) {
                // console.log('group' + group.name + ' is exists')
                // Получаем массивы ключей и значений объекта
                const keys = Object.keys(shortFaculties);
                const values = Object.values(shortFaculties);

                // Ищем индекс значения в массиве значений
                const index = values.indexOf(group.faculty);
                // Получаем ключ по индексу
                const faculty = keys[index];
                const _sched = await this.parseSchedule(faculty, group.level, group.groupID, group)
                // console.log('_ched',_sched)
                
                const sked = await Week.findOne({
                    groupName: groupName,
                    university: RSUE_ID,
                    isEven_: weekNumber % 2 === 0
                }, {__v: 0})
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
                    // console.log('sked', sked)
                    if (sked) {
                        const _sked = JSON.parse(JSON.stringify(sked))
                        const _days = await Promise.all(_sked.days.map(day => {
                            const _day_t = _today.add(Number(day.dayNumber) - 1, 'day').format('YYYY-MM-DDTHH:mm:ss')
                            return {...day, date: _day_t}
                        }))
                        // console.log('days',_days)

                        return {..._sked, mondayDate: today, days: _days}
                    } else {
                        
                        return { days: {}, isError: true}
                    }
                // return {..._sked, mondayDate: today}
                // return {..._sked, mondayDate: today}
            } else {
                throw new Error(`Group ${groupName} is not exists`)
            }

        }
    }
}

export default RsueService