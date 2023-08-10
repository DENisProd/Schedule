import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {groupReducer} from "./groupReducer";
import {searchReducer} from "./searchReducer";
import {messageReducer} from "./messageReducer";
import {compareReducer} from "./compareReducer";
import todoReducer from "./todoReducer";
import {createScheduleReducer} from "./createScheduleReducer";

const rootReducer = combineReducers({
    groups: groupReducer,
    search: searchReducer,
    messages: messageReducer,
    compare: compareReducer,
    todo: todoReducer,
    createSchedule: createScheduleReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))