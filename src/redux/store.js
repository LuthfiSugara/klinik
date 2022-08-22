import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import authReducers from "./reducers/auth-reducers";
import settingReducers from "./reducers/setting-reducers";
import specialistReducers from "./reducers/specialist-reducers";

const rootReducer = combineReducers(
    {
        authReducers,
        settingReducers,
        specialistReducers,
    }
);

export const Store = createStore(rootReducer, applyMiddleware(thunk));
