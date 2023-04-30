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

const GROUP_URLS = {
    "DSTU": "",
    "RSUE": ""
}

class DstuService {
    async fetchGroup(URL, groupId, date) {
        const response = await fetch(URL + groupId + "&sdate=" + (date || dayjs().format('YYYY-MM-DD')));
        return await response.json()
    }

    async adaptToServer (subject) {
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
                name: subject["дисциплина"]
            })

            await subj.save()
            return subj.id
        } catch (e) {
            console.log(e)
        }
    }

    async createDay(groupName, groupID, date, day) {

        let day_processed = []
        day.map(subj => {
            subj.map(subgroup => {
                day_processed.push(subgroup)
            })
        })

        const dayObject = new Day({
            groupName: groupName,
            groupID: groupID,
            date: date,
            subjects: day_processed
        })
        await dayObject.save()

        return dayObject.id
    }

    async processGroupedSchedule(schedule, info) {
        let week = await Promise.all(Object.keys(schedule).map(async date => {
            let day = await Promise.all(schedule[date].map(async subjectArray => {
                return await Promise.all(subjectArray.map(async subject => {
                    return await this.adaptToServer(subject)
                }))
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
            university: 'dstu'
        })

        await this.subscribeToGroup(info.group.groupID)

        await weekObject.save()
        return weekObject.id
    }

    async subscribeToGroup(groupId) {
        const groupFromDb = await GroupUploading.findOne({groupID: groupId})
        if(!groupFromDb) {
            const group = new GroupUploading({
                groupID: groupId
            })
            await group.save()
        }

    }

    async removeWeek(monday) {
        const weeks = await Week.find({ university: 'dstu', mondayDate: monday });
        const promises = weeks.map((w) => w.remove());
        return Promise.all(promises)
            .then(() => {
                console.log('Все документы удалены');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async groupSchedule(schedule) {
        let obj = {};
        let rasp1 = schedule.data.rasp;
        for (let i = 0; i < rasp1.length; i++) {
            const raspDate = rasp1[i]["дата"].split("T");
            if (obj[raspDate[0]]?.length > 0) {
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

    async getWeekIdScheduleFromServer(groupId, date) {
        try {
            return await this.fetchGroup(URLS.GET_GROUP_SCHEDULE, groupId, date).then(async res => {
                return await this.groupSchedule(res)
            })
        } catch (e) {
            console.log(e)
            return {status: 500, message: "Ошибка сервера"}
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
                    __v: 0,
                    _id: 0
                },
            }
        })
    }

    async getWeekScheduleByGroupIdAndDate(group_id, date) {
        const monday = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')
        console.log(monday)
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
                    __v: 0,
                    _id: 0
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
                university: 'dstu',
                groupID: obj.id
            })
            await group.save()
        }))
    }

    async getGroups() {
        // await this.getGroupsFromServer()

        return AcademicGroup.find({university: 'dstu'}, {_id: 0, __v: 0});
    }
}

export default DstuService