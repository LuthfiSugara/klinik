import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { getPatient } from '../redux/actions/patient-actions';
import { getProfile } from '../redux/actions/auth-actions';
import { baseUrl } from '../utils/global';
import { customStyle } from '../utils/global-style';

const Patient = ({navigation}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const {loading, patient} = useSelector((state) => state.patientReducers);
    const {profile} = useSelector((state) => state.authReducers);

    const loadData = async() => {
        await dispatch(getProfile());
        await dispatch(getPatient());
    }

    useEffect(() => {
        loadData();
    }, [isFocused]);
    
    const redirectToDetailPatient = (idPatient) => {
        navigation.navigate('DetailPatient', {
            id: idPatient
        })
    }

    return (
        <View style={tw`${patient.length < 1 ? 'bg-white' : ''} h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>Daftar Pasien</Text>
                <View></View>
            </View>

            <ScrollView style={tw`mt-4 mb-12`}>
                {patient.length > 0 ? (
                    patient.map((d, index) => {
                        return (
                            <View style={tw`bg-white flex flex-row p-4 border-b border-gray-300 mb-4`} key={index}>
                                <View style={[tw``, customStyle.w30]}>
                                    <Image
                                        style={[tw`rounded`, customStyle.aspectSquare]}
                                        source={{
                                            uri: baseUrl + d.foto,
                                        }}
                                    />
                                </View>
                                <View style={[tw`pl-4`, customStyle.w70]}>
                                    <Text style={tw`text-black`}>{d.nama}</Text>
                                    <View style={tw`flex flex-row items-center`}>
                                        <Icon name="phone" size={15} color="#767272" style={tw`mr-1`} solid />
                                        <Text style={tw`text-xs`}>{d?.no_hp}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => redirectToDetailPatient(d.id)}
                                        style={tw`bg-red-600 w-1/2 p-2 rounded mt-3`}
                                    >
                                        <Text style={tw`text-center text-white`}>Detail</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                ) : (
                    <View style={tw``}>
                        <Image 
                            style={[tw`w-full h-full rounded`, customStyle.aspectSquare]}
                            source={require('../assets/images/not-found.jpg')}
                        />
                        <Text style={tw`text-black text-center text-lg`}>Data tidak ditemukan</Text>
                    </View>
                )}
            </ScrollView>

        </View>
    )
}

export default Patient