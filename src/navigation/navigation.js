import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/home";
import Login from "../screens/login";
import { useDispatch, useSelector } from 'react-redux'
import { isLoggedIn } from '../redux/actions/auth-actions';
import Register from "../screens/register";
import Profile from "../screens/profile";
import Specialist from "../screens/specialist";
import Dokter from "../screens/dokter";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const dispatch = useDispatch();
    
    const {is_logged_in} = useSelector(state => state.authReducers);

    const loadData = async() => {
        await dispatch(isLoggedIn());
    }

    useEffect(() => {
        loadData();
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName= {is_logged_in ? "Home" : "Login"}
            >
                {is_logged_in ? (
                    <>
                        <Stack.Screen
                            name="Home" 
                            component={Home} 
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="Profile" 
                            component={Profile} 
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="Specialist" 
                            component={Specialist}
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="Dokter" 
                            component={Dokter}
                            options={{
                                headerShown: false
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Login" 
                            component={Login}
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="Register" 
                            component={Register}
                            options={{
                                headerShown: false
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;