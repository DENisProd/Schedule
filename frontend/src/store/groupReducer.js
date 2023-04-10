import dayjs from "dayjs";

const defaultState = {
    groups: []
}

const ADD_GROUP = "ADD_GROUP"
const NOTHING = "NOTHING"

export const groupReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_GROUP:
            const group = state.groups.find(group => isExists(group, action.payload.id, action.payload.date))
            if (group) return state
            return {...state, groups: [...state.groups, action.payload]}
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

export const addGroupAction = (payload) => ({type: ADD_GROUP, payload})
export const emptyAction = () => ({type: NOTHING})
// export const removeCustomerAction = (payload) => ({type: REMOVE_CUSTOMER, payload})

function isExists (group, groupId, date) {
    if (group.id === groupId) {
        const date1 = dayjs(group.date)
        const date2 = dayjs(date)
        if (date1.isSame(date2)) {
            console.log('isExist')
            return true
        }
    }
    console.log('not exist')

    return false
}