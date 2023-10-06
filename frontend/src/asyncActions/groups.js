import {addGroupAction, emptyAction} from "../store/groupReducer";
import {groupByDate, groupByDateWithSubgroups} from "../utils/groupHelpers";
import dayjs from "dayjs";
import {addMessageAction, MESSAGE_TYPES, WHEN_TYPES} from "../store/messageReducer";
import {URLS} from "../utils/urlsUtils";

export const fetchGroups = (groupId, date, university = 'dstu') => {
    if (!university) university = 'dstu'
    return function (dispatch, getState) {
        const state = getState()
        let group = null
        const _date = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DD')
        if (state.groups) {
            group = state.groups.groups.find(group => isExists(group, groupId, _date, university))
        }
        if (group) dispatch(emptyAction())
        else {
            const urlString = URLS.GET_GROUP_SCHEDULE + groupId + '?date=' + date + "&university=" + (university === 'undefined' ? 'dstu' : university) + "&user=" + localStorage.getItem('clientId')
            console.log(urlString)
            fetch(urlString)
                .then(response => response.json())
                .then(json => {
                    // const processed = groupByDateWithSubgroups(json)
                    const processed = groupByDate(json.week)
                    dispatch(addGroupAction(processed))
                })
                .catch(err => {
                    dispatch(addMessageAction({
                        title: 'Ошибка',
                        text: 'Не удалось получить расписание группы',
                        type: MESSAGE_TYPES.ERROR,
                        when: WHEN_TYPES.FETCH_SCHEDULE
                    }))
                })
        }
    }
}

function isExists (group, groupId, date, univer) {
    if (univer === 'dstu') {
        if (Number(group.id) === Number(groupId)) {
            const date1 = dayjs(group.date)
            const date2 = dayjs(date)
            if (date1.isSame(date2)) {
                return true
            }
        }
    } else {
        if (group.id === groupId) {
            const date1 = dayjs(group.date)
            const date2 = dayjs(date)
            if (date1.isSame(date2)) {
                return true
            }
        }
    }


    return false
}