export const BASE_URL = "https://edu.donstu.ru/api/"

export const UNIVERSITIES_URLS = {
    // UNIVERSITY: 'http://localhost:5000/universities/',
    UNIVERSITY: 'https://schedule.darksecrets.ru/api/universities/',
    // TIME_SCHEDULE: 'http://localhost:5000/time_shedule/',
    TIME_SCHEDULE: 'https://schedule.darksecrets.ru/api/time_shedule/',
    // ACADEMIC_GROUPS: 'http://localhost:5000/groups/'
    ACADEMIC_GROUPS: 'https://schedule.darksecrets.ru/api/groups/',
    // ME: 'http://localhost:5000/user/me',
    ME: 'https://schedule.darksecrets.ru/api/user/me',
    // QUEUE: 'http://localhost:5000/queue/',
    QUEUE: 'https://schedule.darksecrets.ru/api/queue/',
    // SUBJECT: 'http://localhost:5000/subject/',
    SUBJECT: 'https://schedule.darksecrets.ru/api/subject/',
}

export const URLS = {
    // GET_GROUP_SCHEDULE: BASE_URL + "Rasp?idGroup=",
    GET_GROUP_SCHEDULE: "https://schedule.darksecrets.ru/api/group/",
    // GET_GROUP_SCHEDULE: "http://localhost:5000/group/",
    // GET_GROUPS: BASE_URL + "raspGrouplist",
    GET_GROUPS: "https://schedule.darksecrets.ru/api/group/all/",
    // GET_GROUPS: "http://localhost:5000/api/group/all/",
    // GET_TEACHERS: BASE_URL + "raspTeacherlist",
    GET_TEACHERS_SCHEDULE: "http://localhost:5000/teachers/",
    GET_ROOMS: BASE_URL + "raspAudlist",
    GET_UNIVERSITY: BASE_URL + "",
    COMPARE: 'https://schedule.darksecrets.ru/api/group/compare/',
    STATS: "https://schedule.darksecrets.ru/api/stats/",
    ERRORS_LOG: "https://schedule.darksecrets.ru/api/error/",
    ...UNIVERSITIES_URLS,
}