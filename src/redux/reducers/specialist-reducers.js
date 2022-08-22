import {
    GET_SPECIALIST
} from "../types/specialist";

const initialState = {
    loading: true,
    specialist: [],
}

const specialistReducers = (state = initialState, action) => {
    switch(action.type){
        case GET_SPECIALIST: 
            return {
                ...state,
                loading: false,
                specialist: action.payload
            }
        default:
            return state;
    }
}

export default specialistReducers;