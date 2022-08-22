import {
    SIGNIN,
    ISLOGGEDIN,
    SIGNOUT,
    GET_PROFILE,
} from "../types/auth";

const initialState = {
    loading: true,
    profile: [],
    is_logged_in: false,
}

const authReducers= (state = initialState, action) => {
    switch(action.type){
        case SIGNIN: 
            return {
                ...state,
                loading: false,
                profile: action.payload
            }
        case ISLOGGEDIN: 
            return {
                ...state,
                loading: false,
                is_logged_in: action.payload
            }
        case SIGNOUT:
            return {
                ...state,
                loading: false,
                is_logged_in: action.payload
            }
        case GET_PROFILE:
            return {
                ...state,
                loading: false,
                profile: action.payload
            }
        default:
            return state;
    }
}

export default authReducers;