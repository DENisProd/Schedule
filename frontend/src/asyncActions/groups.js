import {addGroupAction, emptyAction} from "../store/groupReducer";
import {groupByDateWithSubgroups} from "../utils/groupHelpers";
import dayjs from "dayjs";
import {addMessageAction, MESSAGE_TYPES} from "../store/messageReducer";
import {URLS} from "../utils/urlsUtils";

export const fetchGroups = (groupId, date) => {
    return function (dispatch, getState) {
        const state = getState()
        let group = null
        console.log(state)
        console.log(date)
        const _date = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DD')
        if (state.groups) {
            group = state.groups.groups.find(group => isExists(group, groupId, _date))
        }
        console.log(group)
        if (group) dispatch(emptyAction())
        else {
            fetch(URLS.GET_GROUP_SCHEDULE + groupId + '&sdate=' + date)
                .then(response => response.json())
                .then(json => {
                    const processed = groupByDateWithSubgroups(json)
                    console.log(processed)
                    dispatch(addGroupAction(processed))
                })
                .catch(err => {
                    dispatch(addMessageAction({
                        title: 'Ошибка',
                        text: err,
                        type: MESSAGE_TYPES.ERROR
                    }))
                })
        }
    }
}

function isExists (group, groupId, date) {
    console.log(date)
    if (group.id === Number(groupId)) {
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