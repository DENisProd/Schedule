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
            return {...state, groups: action.payload}
        case SET_TEACHER:
            if (state.teachers.length > 0) return state
            return {...state, teachers: action.payload}
        case SET_ROOM:
            if (state.rooms.length > 0) return state
            return {...state, rooms: action.payload}
        case SET_UNIVERSITY:
            if (state.universities.length > 0) return state
            return action.payload
        case NOTHING:
            return state
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