import axios from "axios";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../utils/global";

import {
    ADD_APPOINTMENT,
    HISTORY_APPOINTMENT,
} from "../types/appointment";

export const addAppointment = (request) => async (dispatch) => {
    try{
        let token = "";
        await AsyncStorage.getItem('userData')
        .then(value => {
            if(value != null){
                let data = JSON.parse(value);
                token = data;
            }
        });

        const req = axios.post(
            `${baseUrl}/api/add-appointment`, 
            request,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
        ).then(function(response){
            console.log("response : ", response.data);
            if(response.data.status === "success"){
                ToastAndroid.showWithGravityAndOffset(
                    response.data.message,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                );
            }else{
                ToastAndroid.showWithGravityAndOffset(
                    response.data.message,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP,
                    25,
                    50
                );
            }
            
            return response.data;
        }).catch(function(error){
            console.log(error);
        });

        return req;
    }catch(error){
        console.log(error);
    }
}

export const historyAppointment = () => {
    try{
        return async dispatch => {
            await AsyncStorage.getItem('userData')
            .then(value => {
                if(value != null){
                    let token = JSON.parse(value);
                    axios.get(
                        `${baseUrl}/api/all-appointment`, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    ).then(function(response){
                        if(response.data.status === "success"){
                            dispatch({
                                type: HISTORY_APPOINTMENT,
                                payload: response.data.data,
                            });
                        }
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            })
        }
    }catch(error){
        console.log(error);
    }
}