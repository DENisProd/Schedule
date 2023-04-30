import {URLS} from "../utils/urlsUtils";
import {setGroupAction, setRoomAction, setTeacherAction, setUniversityAction, emptyAction} from "../store/searchReducer";
import {addMessageAction, MESSAGE_TYPES} from "../store/messageReducer";

export const SEARCH_TYPES = {
    GROUPS: "GROUPS",
    TEACHERS: "TEACHERS",
    ROOMS: "ROOMS",
    UNIVERSITY: "UNIVERSITY"
}
export const fetchSearch = (type, university = 'dstu') => {
    return function (dispatch, getState) {
        const state = getState()

        let url = ""
        let isExists = false
        let dispatchFunction = () => {}

        switch (type) {
            case SEARCH_TYPES.GROUPS:
                url = URLS.GET_GROUPS + university
                isExists = state.search.groups.length > 0
                dispatchFunction = (json) => setGroupAction(json)
                break
            case SEARCH_TYPES.TEACHERS:
                url = URLS.GET_TEACHERS
                isExists = state.search.teachers.length > 0
                dispatchFunction = (json) => setTeacherAction(json)
                break
            case SEARCH_TYPES.ROOMS:
                url = URLS.GET_ROOMS
                isExists = state.search.rooms.length > 0
                dispatchFunction = (json) => setRoomAction(json)
                break
            case SEARCH_TYPES.UNIVERSITY:
                url = URLS.GET_UNIVERSITY
                isExists = state.search.universities.length > 0
                dispatchFunction = (json) => setUniversityAction(json)
                break
            default:
                dispatch(emptyAction())
                return
        }
        if (isExists) {
            dispatch(emptyAction())
            return
        }
        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    dispatch(dispatchFunction(json))
                })
                .catch(err => {
                    dispatch(addMessageAction({
                        title: 'Ошибка',
                        text: err.message,
                        type: MESSAGE_TYPES.ERROR
                    }))
                })
        }
    }
}