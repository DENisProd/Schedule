import Subject from "../models/subject.js";
import dayjs from "dayjs";
import Day from "../models/dayModel.js";

const VOENKA_TYPES = {
    PREPARATION: 'PREPARATION',
    LECTION: 'LECTION',
    PRACTIC: 'PRACTIC',
    DINNER: 'DINNER',
    TRAINING: 'TRAINING',
}

const day = [
    {
        startTime: '7:30',
        endTime: '7:40',
        name: 'Прибытие обучаемых. Проверка состояния здоровья',
        number: 0,
        type: VOENKA_TYPES.PREPARATION
    },
    {
        startTime: '7:40',
        endTime: '7:55',
        name: 'Утренний осмотр',
        number: 1,
        type: VOENKA_TYPES.PREPARATION
    },
    {
        startTime: '7:55',
        endTime: '8:15',
        name: 'Развод на занятия',
        number: 2,
        type: VOENKA_TYPES.PREPARATION
    },
    {
        startTime: '8:30',
        endTime: '10:00',
        name: 'Учебное занятие 1',
        number: 3,
        type: VOENKA_TYPES.LECTION
    },
    {
        startTime: '10:15',
        endTime: '11:45',
        name: 'Учебное занятие 2',
        number: 4,
        type: VOENKA_TYPES.LECTION
    },
    {
        startTime: '12:00',
        endTime: '13:30',
        name: 'Учебное занятие 3',
        number: 5,
        type: VOENKA_TYPES.LECTION
    },
    {
        startTime: '13:30',
        endTime: '14:20',
        name: 'Обед',
        number: 6,
        type: VOENKA_TYPES.DINNER
    },
    {
        startTime: '14:20',
        endTime: '15:40',
        name: 'Самостоятельная подготовка',
        number: 7,
        type: VOENKA_TYPES.PRACTIC
    },
    {
        startTime: '15:50',
        endTime: '16:20',
        name: 'Тренировка, военно-патриотическое воспитание личного состава',
        number: 8,
        type: VOENKA_TYPES.TRAINING
    },
    {
        startTime: '16:20',
        endTime: '16:30',
        name: 'Подведение итогов',
        number: 9,
        type: VOENKA_TYPES.TRAINING
    },
]

export const createVoenkaDay = async (subjectArray, groupName, groupID, groupID2) => {
    if (subjectArray) {
    return await Promise.all(day.map(async day => {
        return await createVoenkaSchedule(day, subjectArray["дата"], subjectArray["учебныйГод"], groupName, groupID, groupID2)
    }))
}
}

const createVoenkaSchedule = async (data, date, year, groupName, groupID, groupID2) => {
    //if (subject["дисциплина"].includes(voenka)) console.log('voenka')
    //date: dayjs(subject["дата"]).format('YYYY-MM-DD'),
        const subj = new Subject({
            audName: "Шаповалова 2",
            date: dayjs(date).format('YYYY-MM-DD'),
            startTime: data.startTime,
            endTime: data.endTime,
            groupName: groupName,
            groupID: groupID,
            teacherName: 'Полковник 1, Полковник 2',
            teacherId: 0,
            year: year,
            isSubgroup: data.isSubgroup,
            number: data.number,
            name: data.name,
            group: groupID2,
        })

        await subj.save()
        return subj.id
}