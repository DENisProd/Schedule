import {setGroupAction} from "../store/searchReducer";

export const fetchTest = (type) => {
    console.log(type)
    return function (dispatch, getState) {
        console.log("grg")
        const state = getState()
        console.log(state)
        dispatch(setGroupAction(["grgr"]))
    }
}