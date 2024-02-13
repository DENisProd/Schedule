import dayjs from "dayjs";

const defaultState = {
    groups: [],
    cache: []
}

const ADD_GROUP = "ADD_GROUP"
const NOTHING = "NOTHING"
const SET_CACHE = "SET_CACHE"
const SAVE_MY_GROUP = "SAVE_MY_GROUP"

const SAVE_TO_LOCAL_STORAGE = "SAVE_TO_LOCAL_STORAGE"
const LOAD_FROM_LOCAL_STORAGE = "LOAD_FROM_LOCAL_STORAGE"

export const groupReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_GROUP:
            const group = state.groups.find(group => isExists(group, action.payload.id, action.payload.date))
            if (group) return state
            return {...state, groups: [...state.groups, action.payload]}
        case SET_CACHE:
            return {...state, cache: action.payload}
        case SAVE_MY_GROUP:

            return state
        case SAVE_TO_LOCAL_STORAGE:
            const myGroup = JSON.parse(localStorage.getItem("my-group2"))
            const myGroupSchedule = state.groups.filter(gr => gr.name.includes(myGroup.name) && gr.group.includes(myGroup.id))
            localStorage.setItem("groupsState", JSON.stringify(myGroupSchedule));

            return state;
        case LOAD_FROM_LOCAL_STORAGE:
            // Загружаем состояние из localStorage
            const savedState = JSON.parse(localStorage.getItem("groupsState")) || defaultState;
            // console.log(savedState)
            return { ...state, cache: savedState };
        case NOTHING:
            return state
        default:
            return state
    }
}

export const addGroupAction = (payload) => ({type: ADD_GROUP, payload})
export const emptyAction = () => ({type: NOTHING})

export const saveToLocalStorageAction = () => ({ type: SAVE_TO_LOCAL_STORAGE });
export const loadFromLocalStorageAction = () => ({ type: LOAD_FROM_LOCAL_STORAGE });

function isExists (group, groupId, date) {
    if (group.id === groupId) {
        const date1 = dayjs(group.date)
        const date2 = dayjs(date)
        if (date1.isSame(date2)) {
            return true
        }
    }

    return false
}