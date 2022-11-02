import React, { useEffect } from "react";
import { Alert, Button, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, signOut } from "../redux/actions/auth-actions";
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from "@react-navigation/native";
import { baseUrl } from "../utils/global";
import { customStyle } from "../utils/global-style";

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

    const redirectToProfile = () => {
        if(profile.id_level == 3){
            navigation.navigate('DetailDokter', {
                id: profile.id
            });
        }else{
            navigation.navigate('Profile');
        }
    }

    return (
        <View style={tw`h-full bg-white`}>
            <View style={tw`flex flex-row justify-between items-center bg-gray-200 p-4`}>
                <TouchableOpacity style={[tw`flex flex-row items-center`]} onPress={redirectToProfile}>
                    <Image 
                        style={tw`w-8 h-8 mr-2 rounded-full`}
                        source={{
                            uri: baseUrl + profile.foto,
                        }} 
                    />
                    <Text style={tw`text-sm text-black`}>{profile.nama}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => {
                        Alert.alert(
                            "Logout",
                            "Apakah anda yakin ?",
                            [
                                { text: "Tidak" },
                                { text: "Ya", onPress: () => {
                                    logout();
                                }}
                            ]
                        );
                    }}>
                    <Icon name="power-off" size={20} color="#000000" style={[tw``]} solid />
                </TouchableOpacity>
            </View>
            
            <ScrollView>
                <View style={tw`w-full mt-8 px-4 flex flex-row flex-wrap justify-center items-center`}>
                    {profile.id_level === 1 && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Specialist')}
                            style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                        >
                            <Image
                                style={tw`w-20 h-20 rounded-full`}
                                source={require('../assets/images/specialist.jpg')}
                            />
                            <Text style={tw`font-semibold text-gray-600 text-center`}>Spesialis</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Dokter')}
                        style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                    >
                        <Image
                            style={tw`w-20 h-20 rounded-full`}
                            source={require('../assets/images/dokter.jpg')}
                        />
                        <Text style={tw`font-semibold text-gray-600 text-center`}>Dokter</Text>
                    </TouchableOpacity>
                    {profile.id_level === 2 && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('DoctorAppointment')}
                            style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                        >
                            <Image
                                style={tw`w-20 h-20 rounded-full`}
                                source={require('../assets/images/temu-dokter.jpg')}
                            />
                            <Text style={tw`font-semibold text-gray-600 text-center`}>Buat Janji</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('History')}
                        style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                    >
                        <Image
                            style={tw`w-20 h-20 rounded-full`}
                            source={require('../assets/images/history.jpg')}
                        />
                        <Text style={tw`font-semibold text-gray-600 text-center`}>Riwayat Kunjungan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Consultation')}
                        style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                    >
                        <Image
                            style={tw`w-20 h-20 rounded-full`}
                            source={require('../assets/images/konsultasi.jpg')}
                        />
                        <Text style={tw`font-semibold text-gray-600 text-center`}>Konsultasi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ProfileKlinik')}
                        style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                    >
                        <Image
                            style={tw`w-20 h-20 rounded-full`}
                            source={require('../assets/images/profile-klinik.jpg')}
                        />
                        <Text style={tw`font-semibold text-gray-600 text-center`}>Profile Klinik</Text>
                    </TouchableOpacity>
                    {profile.id_level === 1 && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SettingPrinter')}
                            style={tw`w-2/6 px-4 py-4 m-2 items-center rounded-xl`}
                        >
                            <Image
                                style={tw`w-20 h-20 rounded-full`}
                                source={require('../assets/images/printer.jpg')}
                            />
                            <Text style={tw`font-semibold text-gray-600 text-center`}>Setting Printer</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Home;