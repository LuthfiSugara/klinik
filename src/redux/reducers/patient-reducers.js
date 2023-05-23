import {
    GET_PATIENT,
    DETAIL_PATIENT
} from "../types/patient";

const initialState = {
    loading: true,
    patient: [],
    detail_patient: [],
}

const patientReducers = (state = initialState, action) => {
    switch(action.type){
        case GET_PATIENT: 
            return {
                ...state,
                loading: false,
                patient: action.payload
            }
        case DETAIL_PATIENT: 
            return {
                ...state,
                loading: false,
                detail_patient: action.payload
            }
        default:
            return state;
    }
}

export default patientReducers;