import fetch from "node-fetch";
import * as cheerio from 'cheerio';
import Subject from "../models/subject.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekOfSubjects.js";
import {BASE_URL_RSUE} from "../constants/URLS.js";
import AcademicGroup from "../models/academicGroup.js";

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
    4: "УэФ'",
    5: "ФЭиФинансы",
    6: "Юридический",
    7: "ФЛиЖ",
}

class RsueService {
    async fetchRsue(type, facultyId, courseId) {
        const formData = new FormData();
        formData.append('query', type);
        formData.append('type_id', facultyId);
        formData.append('kind_id', courseId);

        const options = {
            method: 'POST',
            body: formData
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
             return await Promise.all(Object.keys(faculties).map(async faculty => {
                const response = await this.fetchRsue('getKinds', faculty)
                if (response) {
                    let data = await Promise.all(response.map(async resp => {
                        const response2 = await this.fetchRsue('getCategories', faculty, resp.kind_id)
                        // let groups2 = []
                        response2.map(async obj => {
                            const group = new AcademicGroup({
                                faculty: shortFaculties[faculty],
                                groupID: obj.category_id,
                                name: obj.category,
                                level: Number.parseInt(resp.kind_id),
                                university: 'rsue'
                            })
                            await group.save()
                        })
                        // return groups2
                    }))
                    // return this.concatArrayOfArray(data)

                }
            }))
    }

    async getGroups() {
        // await this.getGroupsFromServer()

        return await AcademicGroup.find({university: 'rsue'}, {_id: 0, __v: 0})
    }

    uuid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    async processSchedule(schedule, mode, groupName) {
        let arr = []
        for (const e of schedule) {
            const cont = cheerio.load(e)
            const dayName = cont('div').children().first().text()
            const subjects = []
            const subjectsHtml = cont('div').children().first().nextAll().toArray()

            for (const subj of subjectsHtml) {
                const shtml = cheerio.load(subj)
                const bottomBlock = shtml('div').children()
                let year = new Date()
                let time = shtml('div').children().first().children('span').text()
                let timeArray = time.split('—')
                let podgr = shtml('div').children().first().children('span').children('span').text()
                let isSubgroup = false
                if (podgr)
                    if (Number.parseInt(podgr.replace(/[^0-9\.]/g, '')) !== 1)
                        isSubgroup = true

                let subText = timeArray[1].split(' ')[3]

                const _subject = new Subject({
                    groupName,
                    startTime: timeArray[0].trim(),
                    endTime: timeArray[1].split(' ')[1],
                    name: shtml('div').children().first().next().children('span').text() + (isSubgroup ? (' п/г ' + subText) : ''),
                    teacherName: shtml('div').children().first().next().next().children('span').text(),
                    audName: bottomBlock.children('.aud').text(),
                    type: bottomBlock.children('.type').text(),
                    year: year.getFullYear(),
                    number: subjectNumbers[timeArray[0].trim()],
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
        const weeks = await Week.find({ university: 'rsue' });
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

    }

    async parseSchedule(facultyId, kursId, groupId) {
        const formData = new FormData();
        formData.append('f', facultyId);
        formData.append('k', kursId);
        formData.append('g', groupId);
        formData.append('uuid', this.uuid(groupId));

        const options = {
            method: 'POST',
            body: formData
        }

        return await fetch('https://rsue.ru/raspisanie/', options)
            .then(res => res.text())
            .then(async data => {
                const $ = cheerio.load(data);
                const container = $('.container').last()
                const groupName = container.find('h1').first().text().replace('Группа ', '')
                const oddWeekArray = container.find('.row').first().children().toArray()
                const evenWeekArray = container.children('.row').last().children().toArray()

                const oddProcessed = await this.processSchedule(oddWeekArray, 'odd', groupName)
                const evenProcessed = await this.processSchedule(evenWeekArray, 'even', groupName)

                const oddWeek = new Week({
                    isEven: false,
                    days: oddProcessed,
                    year: new Date().getFullYear(),
                    groupName,
                    curWeekNumber: 1,
                    university: 'rsue'
                })

                await oddWeek.save()

                const evenWeek = new Week({
                    isEven: true,
                    days: evenProcessed,
                    year: new Date().getFullYear(),
                    groupName,
                    curWeekNumber: 2,
                    university: 'rsue'
                })

                await evenWeek.save()

                return {oddId: oddWeek.id, evenId: evenWeek.id}
            })
    }

    async getSchedule(weekNumber, groupName) {
        console.log(weekNumber, groupName)
        // return Week.findOne({groupName: groupName, isEven: weekNumber % 2 === 0, university: 'rsue'})
        return Week.findOne({university: 'rsue', isEven: weekNumber % 2 === 0, groupName: groupName})
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
    }

    async getWeekScheduleByGroupId(group_id) {
        const schedule = await Week.findOne({groupID: group_id}, {__v: 0})
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
        if (schedule) return schedule
        else {
            const group = await AcademicGroup.findOne({name: group_id, university: 'rsue'})
            if (group) {
                // Получаем массивы ключей и значений объекта
                const keys = Object.keys(shortFaculties);
                const values = Object.values(shortFaculties);

                // Ищем индекс значения в массиве значений
                const index = values.indexOf(group.faculty);

                // Получаем ключ по индексу
                const faculty = keys[index];
                return await this.parseSchedule(faculty, level, group.groupID)
            } else {
                throw new Error(`Group ${group_id} is not exists`)
            }

        }
    }
}

export default RsueService