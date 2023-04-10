import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {groupReducer} from "./groupReducer";

const rootReducer = combineReducers({
    groups: groupReducer,
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))