import dayjs from "dayjs";

const defaultState = {
    groupsc: [],
    compares: []
}

const ADD2_GROUP = "ADD_GROUP"
const SET_COMPARE = "SET_COMPARE"
const NOTHING = "NOTHING"

export const compareReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD2_GROUP:
            console.log(action.payload)
            //const group = state.groups.find(group => group.id === action.payload.id)
            //if (group) return state
            console.log(state.groupsc)
            return {...state, groupsc: [...state.groupsc, action.payload]}
        case SET_COMPARE:
            return {...state, compares: action.payload}
        case NOTHING:
            return state
        default:
            return state
    }
}

export const addGroupToCompare = (payload) => ({type: ADD2_GROUP, payload})
export const setCompare = (payload) => ({type: SET_COMPARE, payload})
export const emptyAction = () => ({type: NOTHING})