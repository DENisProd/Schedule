const defaultState = {
    messages: [],
}

export const MESSAGE_TYPES = {
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}

const ADD_MESSAGE = "ADD_MESSAGE"
const REMOVE_MESSAGE = "REMOVE_MESSAGE"

export const messageReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            const message = {
                id: Date.now(),
                title: action.payload.title,
                type: action.payload.type,
                text: action.payload.text
            }
            return {...state, messages: [...state.messages, message]}
        case REMOVE_MESSAGE:
            return {...state, messages: state.messages.filter(messages => messages.id !== action.payload)}
        default:
            return state
    }
}

export const addMessageAction = (payload) => ({type: ADD_MESSAGE, payload})
export const removeMessageAction = (payload) => ({type: REMOVE_MESSAGE, payload})