import {
    GET_DOKTER,
    DETAIL_DOKTER
} from "../types/dokter";

const initialState = {
    loading: true,
    dokter: [],
    detail_dokter: [],
}

const dokterReducers = (state = initialState, action) => {
    switch(action.type){
        case GET_DOKTER: 
            return {
                ...state,
                loading: false,
                dokter: action.payload
            }
        case DETAIL_DOKTER: 
            return {
                ...state,
                loading: false,
                detail_dokter: action.payload
            }
        default:
            return state;
    }
}

export default dokterReducers;