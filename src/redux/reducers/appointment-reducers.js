import {
    HISTORY_APPOINTMENT
} from "../types/appointment";

const initialState = {
    loading: true,
    history_appointment: [],
}

const appointmentReducers = (state = initialState, action) => {
    switch(action.type){
        case HISTORY_APPOINTMENT: 
            return {
                ...state,
                loading: false,
                history_appointment: action.payload
            }
        default:
            return state;
    }
}

export default appointmentReducers;