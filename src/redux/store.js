import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import authReducers from "./reducers/auth-reducers";
import settingReducers from "./reducers/setting-reducers";
import specialistReducers from "./reducers/specialist-reducers";
import dokterReducers from "./reducers/dokter-reducers";
import appointmentReducers from "./reducers/appointment-reducers";

const rootReducer = combineReducers(
    {
        authReducers,
        settingReducers,
        specialistReducers,
        dokterReducers,
        appointmentReducers,
    }
);

export const Store = createStore(rootReducer, applyMiddleware(thunk));
