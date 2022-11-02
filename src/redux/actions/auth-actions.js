import axios from "axios";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../utils/global";

import {
    SIGNIN,
    GENDER,
    ISLOGGEDIN,
    SIGNOUT,
    REGISTER,
    GET_PROFILE,
    UPDATE_PROFILE,
} from "../types/auth";

export const signIn = (data) => {
    try{
        return async dispatch => {
            console.log(baseUrl);
            axios.post(
                `${baseUrl}/api/login`, 
                data,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(function(response){
                if(response.data.status === "success"){
                    AsyncStorage.setItem('userData', JSON.stringify(response.data.access_token));

                    dispatch({
                        type: ISLOGGEDIN,
                        payload: true,
                    });
                }else{
                    dispatch({
                        type: ISLOGGEDIN,
                        payload: false,
                    });

                    ToastAndroid.showWithGravityAndOffset(
                        response.data.message,
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
                }
            }).catch(function(error){
                console.log(error);
            });
        }
    }catch(error){
        console.log(error);
    }
}

export const isLoggedIn = () => {
    try{
        return async dispatch => {
            await AsyncStorage.getItem('userData')
            .then(value => {
                if(value != null){
                    let token = JSON.parse(value);
                    axios.get(
                        `${baseUrl}/api/profile`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    ).then(function(response){
                        if(response.data.status === "success"){
                            dispatch({
                                type: ISLOGGEDIN,
                                payload: true,
                            });
                        }else{
                            dispatch({
                                type: ISLOGGEDIN,
                                payload: false,
                            });

                            AsyncStorage.removeItem('userData');
                        }
                    }).catch(function(error){
                        console.log(error);
                        dispatch({
                            type: ISLOGGEDIN,
                            payload: false,
                        });

                        AsyncStorage.removeItem('userData');
                    });
                }else{
                    dispatch({
                        type: ISLOGGEDIN,
                        payload: false,
                    });
                }
            })

        }
    }catch(error){
        console.log(error);
    }
}

export const signOut = () => {
    try{
        return async dispatch => {
            await AsyncStorage.removeItem('userData');
    
            dispatch({
                type: SIGNOUT,
                payload: false,
            });
        }
    }catch(error){
        console.log(error);
    }
}

export const register = (request) => async (dispatch) => {
    try{
        const res = axios.post(
            `${baseUrl}/api/register`, 
            request,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

        return res;
    }catch(error){
        console.log(error);
    }
}

export const getProfile = () => {
    try{
        return async dispatch => {
            await AsyncStorage.getItem('userData')
            .then(value => {
                if(value != null){
                    let token = JSON.parse(value);
                    axios.get(
                        `${baseUrl}/api/profile`, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            }
                        }
                    ).then(function(response){
                        // console.log("respponse : ", response.data);
                        if(response.data.status === "success"){
                            dispatch({
                                type: GET_PROFILE,
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

export const updateProfile = (request) => async (dispatch) => {
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
            `${baseUrl}/api/update-profile`, 
            request,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

        // dispatch({
        //     type: REGISTER,
        //     payload: req
        // });

        return req;
    }catch(error){
        console.log(error);
    }
}

export const getGender = () => {
    try{
        return async dispatch => {
            await AsyncStorage.getItem('userData')
            .then(value => {
                if(value != null){
                    let token = JSON.parse(value);
                    axios.get(
                        `${baseUrl}/api/gender`, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
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
            })
        }
    }catch(error){
        console.log(error);
    }
}