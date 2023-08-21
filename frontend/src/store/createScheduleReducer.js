const defaultState = {
    stage1: {},
    stage2: [],
    stage2FromDb: null,
    stage3: {},
    stage4: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    },
    allScheduleTimes: []
}

export const SET_STAGE1 = 'SET_STAGE1'
export const SET_STAGE2 = 'SET_STAGE2'
export const SET_STAGE2_FROMDB = 'SET_STAGE2_FROMDB'
export const SET_STAGE3 = 'SET_STAGE3'
export const SET_STAGE4 = 'SET_STAGE4'
export const SET_ALL_SCHEDULE_TIMES = 'SET_ALL_SCHEDULE_TIMES'

export const ADD_SCHEDULE_TIME = 'ADD_SCHEDULE_TIME'
export const REMOVE_SCHEDULE_TIME = 'REMOVE_SCHEDULE_TIME'
export const ADD_SCHEDULE = 'ADD_SCHEDULE'

export const ADD_TO_MONDAY = 'ADD_TO_MONDAY'
export const ADD_TO_TUESDAY = 'ADD_TO_TUESDAY'
export const ADD_TO_WEDNESDAY = 'ADD_TO_WEDNESDAY'
export const ADD_TO_THURSDAY = 'ADD_TO_THURSDAY'
export const ADD_TO_FRIDAY = 'ADD_TO_FRIDAY'
export const ADD_TO_SATURDAY = 'ADD_TO_SATURDAY'
export const ADD_TO_SUNDAY = 'ADD_TO_SUNDAY'

export const CLEAR_CREATE = 'CLEAR_CREATE'

export const createScheduleReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_STAGE1:
            return {...state, stage1: action.payload}
        case SET_STAGE2:
            return {...state, stage2: [action.payload]}
        case SET_STAGE2_FROMDB:
            return {...state, stage2FromDb: action.payload}
        case ADD_SCHEDULE_TIME:
            return {...state, stage2: [...state.stage2, action.payload]}
        case REMOVE_SCHEDULE_TIME:
            const updatedStage2 = state.stage2.filter((item, index) => index !== action.payload);
            return {
                ...state,
                stage2: updatedStage2
            };
        case SET_STAGE3:
            return {...state, stage3: action.payload}
        case SET_STAGE4:
            return {...state, stage4: [action.payload]}
        case SET_ALL_SCHEDULE_TIMES:
            return {...state, allScheduleTimes: [...action.payload]}
        case ADD_SCHEDULE:
            return {...state, stage4: [...state.stage4, action.payload]}

        case ADD_TO_MONDAY:
            return { ...state, stage4: { ...state.stage4, monday: [...state.stage4.monday, action.payload] }}
        case ADD_TO_TUESDAY:
            return { ...state, stage4: { ...state.stage4, tuesday: [...state.stage4.tuesday, action.payload] }}
        case ADD_TO_WEDNESDAY:
            return { ...state, stage4: { ...state.stage4, wednesday: [...state.stage4.wednesday, action.payload] }}
        case ADD_TO_THURSDAY:
            return { ...state, stage4: { ...state.stage4, thursday: [...state.stage4.thursday, action.payload] }}
        case ADD_TO_FRIDAY:
            return { ...state, stage4: { ...state.stage4, friday: [...state.stage4.friday, action.payload] }}
        case ADD_TO_SATURDAY:
            return { ...state, stage4: { ...state.stage4, saturday: [...state.stage4.saturday, action.payload] }}
        case ADD_TO_SUNDAY:
            return { ...state, stage4: { ...state.stage4, sunday: [...state.stage4.sunday, action.payload] }}
        case CLEAR_CREATE:
            return defaultState
        default:
            return state
    }
}

export const setStage1Action = (payload) => ({type: SET_STAGE1, payload})
export const setStage2Action = (payload) => ({type: SET_STAGE2, payload})
export const setStage2FromDbAction = (payload) => ({type: SET_STAGE2_FROMDB, payload})
export const setStage3Action = (payload) => ({type: SET_STAGE3, payload})
export const setStage4Action = (payload) => ({type: SET_STAGE4, payload})
export const setAllScheduleTimeAction = (payload) => ({type: SET_ALL_SCHEDULE_TIMES, payload})

export const addScheduleTimeStage2 = (payload) => ({type: ADD_SCHEDULE_TIME, payload})
export const removeScheduleTimeStage2 = (payload) => ({type: REMOVE_SCHEDULE_TIME, payload})
export const addScheduleStage4 = (payload) => ({type: ADD_SCHEDULE, payload})

export const addToMonday = (payload) => ({type: ADD_TO_MONDAY, payload})
export const addToTuesday = (payload) => ({type: ADD_TO_TUESDAY, payload})
export const addToWednesday = (payload) => ({type: ADD_TO_WEDNESDAY, payload})
export const addToThursday = (payload) => ({type: ADD_TO_THURSDAY, payload})
export const addToFriday = (payload) => ({type: ADD_TO_FRIDAY, payload})
export const addToSaturday = (payload) => ({type: ADD_TO_SATURDAY, payload})
export const addToSunday = (payload) => ({type: ADD_TO_SUNDAY, payload})

export const clearCreate = () => ({ type: CLEAR_CREATE })