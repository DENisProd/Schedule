const defaultState = {
    user: null,
}

const SET_USER = "SET_USER"
const REMOVE_USER = "REMOVE_USER"

export const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_USER:
            console.log(action)
            return {...state, user: action.user}
        case REMOVE_USER:
            return {...state, user: null}
        default:
            return state
    }
}

export const setUserAction = (user) => ({type: SET_USER, user})
export const removeUserAction = () => ({type: REMOVE_USER})