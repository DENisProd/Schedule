import dayjs from "dayjs";

const defaultState = {
    groups: [],
    lastGroups: [],
    teachers: [],
    lastTeachers: [],
    rooms: [],
    lastRooms: [],
    universities: [],
    lastUniversities: [],
    favoriteGroups: [],
    favoriteTeachers: [],
    favoriteRooms: [],
}

const SET_GROUP = "SET_GROUP"
const SET_TEACHER = "SET_TEACHER"
const SET_ROOM = "SET_ROOM"
const SET_UNIVERSITY = "SET_UNIVERSITY"
const NOTHING = "NOTHING"

export const searchReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_GROUP:
            if (state.groups.length > 0) return state
            return action.payload
        case SET_TEACHER:
            if (state.teachers.length > 0) return state
            return action.payload
        case SET_ROOM:
            if (state.room.length > 0) return state
        return action.payload
        case SET_UNIVERSITY:
            if (state.universities.length > 0) return state
            return action.payload
        case NOTHING:
            return state
        // case ADD_CUSTOMER:
        //     return {...state, customers: [...state.customers, action.payload]}
        // case REMOVE_CUSTOMER:
        //     return {...state, customers: state.customers.filter(customer => customer.id !== action.payload)}
        default:
            return state
    }
}

export const setGroupAction = (payload) => ({type: SET_GROUP, payload})
export const setTeacherAction = (payload) => ({type: SET_TEACHER, payload})
export const setRoomAction = (payload) => ({type: SET_ROOM, payload})
export const setUniversityAction = (payload) => ({type: SET_UNIVERSITY, payload})
export const emptyAction = () => ({type: NOTHING})
// export const removeCustomerAction = (payload) => ({type: REMOVE_CUSTOMER, payload})