import React, { useEffect } from "react";
import { Button, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, signOut } from "../redux/actions/auth-actions";
import tw from 'twrnc';
import { useIsFocused } from "@react-navigation/native";
import { baseUrl } from "../utils/global";

const Home = ({navigation}) => {
    const dispatch = useDispatch();

    const {loading, profile} = useSelector((state) => state.authReducers);
    const isFocused = useIsFocused();

    const loadData = async() => {
        await dispatch(getProfile());
    }

    useEffect(() => {
        loadData();
    }, [isFocused]);

    const logout = async() => {
        await dispatch(signOut());
    }

    return (
        <View style={tw`h-full bg-white`}>
            <Pressable style={tw`bg-gray-200 p-2 flex flex-row`} onPress={() => navigation.navigate('Profile')}>
                <Image 
                    style={tw`w-8 h-8 mr-2 rounded-full`}
                    source={{
                        uri: baseUrl + profile.foto,
                    }} 
                />
                <Text style={tw`text-lg`}>{profile.nama}</Text>
            </Pressable>
            <Button onPress={logout} title="logout"/>
            
            <ScrollView>
                <View style={tw`w-full mt-8 px-4 flex flex-row flex-wrap justify-center`}>
                    <Pressable
                        onPress={() => navigation.navigate('Specialist')}
                        style={tw`w-2/6 px-4 py-8 m-2 items-center rounded-xl`}
                    >
                        <Image
                            style={tw`w-20 h-20 rounded-full`}
                            source={require('../assets/images/specialist.jpg')}
                        />
                        <Text style={tw`text-lg font-semibold text-gray-600`}>Spesialis</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate('Dokter')}
                        style={tw`w-2/6 px-4 py-8 m-2 items-center rounded-xl`}
                    >
                        <Image
                            style={tw`w-20 h-20 rounded-full`}
                            source={require('../assets/images/dokter.jpg')}
                        />
                        <Text style={tw`text-lg font-semibold text-gray-600`}>Dokter</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

export default Home;