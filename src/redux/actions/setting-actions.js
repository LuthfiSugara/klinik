import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../utils/global";

import {
    GENDER
} from "../types/setting";

export const getGender = (data) => {
    try{
        return async dispatch => {
            axios.get(
                `${baseUrl}/api/gender`, 
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(function(response){
                if(response.data.status === "success"){
                    dispatch({
                        type: GENDER,
                        payload: response.data.data,
                    });
                }
            }).catch(function(error){
                console.log(error);
            });
        }
    }catch(error){
        console.log(error);
    }
}