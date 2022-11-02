import React from 'react'
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { getConsultation } from '../redux/actions/consultation-actions';
import { useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { customStyle } from '../utils/global-style';
import { getProfile } from '../redux/actions/auth-actions';

const Consultation = ({navigation}) => {

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const {consultation} = useSelector((state) => state.consultationReducers);
    const {profile} = useSelector((state) => state.authReducers);

    const loadData = async() => {
       await dispatch(getConsultation());
       await dispatch(getProfile());
    }

    useEffect(() => {
        loadData();
    }, [isFocused]);

    const redirectToDetailConsultation = (id) => {
        navigation.navigate('DetailConsultation', {
            id: id
        });
    }

    return (
        <View style={tw`bg-white h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>Konsultasi</Text>
                {profile.id_level == 2 ? (
                    <Pressable onPress={() => navigation.navigate('AddConsultation')}>
                        <Icon name="notes-medical" size={30} color="#000000" style={tw`mr-1`} solid />
                    </Pressable>
                ) : (
                    <View></View>
                )}
            </View>

            <ScrollView style={tw`mt-4`}>
                <View style={tw`mx-2`}>
                    {consultation.length > 0 ? (
                        consultation.map((consul, index) => {
                            return (
                                <TouchableOpacity onPress={() => redirectToDetailConsultation(consul.id)} style={tw`flex flex-row justify-between items-center bg-white border border-gray-300 rounded p-3 mb-4`} key={index}>
                                    <View>
                                        <Text style={tw`text-black`}>{consul.consultation}</Text>
                                        <Text style={tw`text-xs`}>{consul.dokter.nama}</Text>
                                    </View>
                                    <Icon name="angle-right" size={20} color="#000000" style={tw`mr-1`} solid />
                                </TouchableOpacity>
                            )
                        })
                    ) : (
                        <View style={tw``}>
                            <Image 
                                style={[tw`w-full h-full rounded`, customStyle.aspectSquare]}
                                source={require('../assets/images/not-found.jpg')}
                            />
                            <Text style={tw`text-black text-center text-lg`}>Belum ada konsultasi</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Consultation