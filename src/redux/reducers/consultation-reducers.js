import {
    GET_CONSULTATION,
    GET_DETAIL_CONSULTATION,
} from "../types/consultation";

const initialState = {
    loading: true,
    consultation: [],
    detail_consultation: [],
}

const consultationReducers = (state = initialState, action) => {
    switch(action.type){
        case GET_CONSULTATION: 
            return {
                ...state,
                loading: false,
                consultation: action.payload
            }
        case GET_DETAIL_CONSULTATION: 
            return {
                ...state,
                loading: false,
                detail_consultation: action.payload
            }
        default:
            return state;
    }
}

export default consultationReducers;