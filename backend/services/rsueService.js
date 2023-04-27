import fetch from "node-fetch";
import dayjs from "dayjs";
import * as cheerio from 'cheerio';
import Subject from "../models/subject.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekOfSubjects.js";
import {BASE_URL_RSUE} from "../constants/URLS.js";

import zlib from 'zlib'
import * as pako from "pako";

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

class RsueService {
    async fetchRsue(type, facultyId, courseId) {
        const formData = new FormData();
        formData.append('query', 'getKinds');
        formData.append('type_id', facultyId);
        formData.append('kind_id', courseId);

        const options = {
            method: 'POST',
            body: formData
        }

        const response = await fetch(BASE_URL_RSUE, options)
        const encoding = response.headers.get('content-encoding');
        let body = await response.arrayBuffer();
        if (body[0] !== 0x1f || body[1] !== 0x8b) {
            console.log("The data is not a valid gzip stream")
        }
        if (encoding !== 'gzip') {
            console.log("The response is not gzip-compressed")
        }
        if (encoding === 'gzip') {
            body = await new Promise((resolve, reject) => {
                zlib.gunzip(body, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
                const expectedLength = Number(response.headers.get('content-length'));
                if (body.byteLength !== expectedLength) {
                    console.log("The compressed data stream is corrupted or truncated")
                }
            });
        }
        return body.toString();
    }

    async fetchGroups(courseId, facultyId) {


        return await fetch('https://rsue.ru/raspisanie/', options)
    }

    async fetchCurses(facultyId) {

        const response = await this.fetchRsue('getCategories', facultyId)
        console.log(response)
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

        const response = await fetch('https://rsue.ru/raspisanie/', options)
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
            });

        return response
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
        return Week.findOne({groupID: group_id}, {__v: 0})
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
}

export default RsueService