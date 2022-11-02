import {
    HISTORY_APPOINTMENT, QUEUE_APPOINTMENT
} from "../types/appointment";
// 

const initialState = {
    load_appointment: true,
    loading: true,
    history_appointment: [],
    queue: [],
}

const appointmentReducers = (state = initialState, action) => {
    switch(action.type){
        case HISTORY_APPOINTMENT: 
            return {
                ...state,
                loading: false,
                history_appointment: action.payload
            }
        case QUEUE_APPOINTMENT: 
            return {
                ...state,
                load_appointment: false,
                queue: action.payload.data
            }
        default:
            return state;
    }
}

export default appointmentReducers;