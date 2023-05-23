import axios from "axios";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../utils/global";

import {
    ADD_APPOINTMENT,
    HISTORY_APPOINTMENT,
    QUEUE_APPOINTMENT,
    UPDATE_STATUS_APPOINTMENT,
} from "../types/appointment";
import { UseGetAction } from "../../utils/use-get-action";

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

// export const historyAppointment = () => 
//     UseGetAction(
//         `all-appointment`,
//         HISTORY_APPOINTMENT,
//         undefined
//     );

export const updateStatusAppointment = (id, id_status) => async (dispatch) => {
    try{
        let token = "";
        await AsyncStorage.getItem('userData')
        .then(value => {
            if(value != null){
                let data = JSON.parse(value);
                token = data;
            }
        });

        const req = axios.get(
            `${baseUrl}/api/update-status-appointment/${id}/${id_status}`, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
        ).then(function(response){
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

// export const updateStatusAppointment = (id, id_status) => 
//     UseGetAction(
//         `update-status-appointment/${id}/${id_status}`,
//         UPDATE_STATUS_APPOINTMENT,
//         undefined
//     );

export const getQueueAppointment = (id_dokter, date) => 
    UseGetAction(
        'get-queue-appointment',
        QUEUE_APPOINTMENT,
        {id_dokter: id_dokter, date: date}
    );
