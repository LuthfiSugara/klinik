import axios from "axios";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../utils/global";

import {
    GET_CONSULTATION, 
    GET_DETAIL_CONSULTATION,
} from "../types/consultation";

export const getConsultation = () => {
    try{
        return async dispatch => {
            await AsyncStorage.getItem('userData')
            .then(value => {
                if(value != null){
                    let token = JSON.parse(value);
                    axios.get(
                        `${baseUrl}/api/get-consultation`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    ).then(function(response){
                        if(response.data.status === "success"){
                            dispatch({
                                type: GET_CONSULTATION,
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

export const createConsultation = (request) => async (dispatch) => {
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
            `${baseUrl}/api/add-consultation`, 
            request,
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

export const getDetailConsultation = (id) => {
    try{
        return async dispatch => {
            await AsyncStorage.getItem('userData')
            .then(value => {
                if(value != null){
                    let token = JSON.parse(value);
                    axios.get(
                        `${baseUrl}/api/get-detail-consultation/${id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    ).then(function(response){
                        if(response.data.status === "success"){
                            dispatch({
                                type: GET_DETAIL_CONSULTATION,
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

export const createDetailConsultation = (request) => async (dispatch) => {
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
            `${baseUrl}/api/add-detail-consultation`, 
            request,
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