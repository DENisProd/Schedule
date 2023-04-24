export const BASE_URL_DSTU = "https://edu.donstu.ru/api/"
export const BASE_URL_RSUE = "https://rsue.ru/raspisanie/query.php"
// POST
// query: getKinds
// type_id:1
//
// query:getCategories
// type_id:1
// kind_id:3

export const URLS = {
    GET_GROUP_SCHEDULE: BASE_URL_DSTU + "Rasp?idGroup=",
    GET_GROUPS: BASE_URL_DSTU + "raspGrouplist",
    GET_TEACHERS: BASE_URL_DSTU + "raspTeacherlist",
    GET_ROOMS: BASE_URL_DSTU + "raspAudlist",
    GET_UNIVERSITY: BASE_URL_DSTU + "",
    STATS: "https://schedule.darksecrets.ru/api/stats/"
}