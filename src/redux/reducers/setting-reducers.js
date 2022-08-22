import {
    GENDER
} from "../types/setting";

const initialState = {
    loading: true,
    jk: []
}

const settingReducers= (state = initialState, action) => {
    switch(action.type){
        case GENDER: 
            return {
                ...state,
                loading: false,
                jk: action.payload
            }
        default:
            return state;
    }
}

export default settingReducers;