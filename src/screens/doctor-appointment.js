import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDokter } from '../redux/actions/dokter-actions';
import { customStyle } from '../utils/global-style';
import { baseUrl } from '../utils/global';

const DoctorAppointment = ({navigation}) => {
    const dispatch = useDispatch();

    const {loading, dokter} = useSelector((state) => state.dokterReducers);

    const loadData = async() => {
       await dispatch(getDokter());
    }

    useEffect(() => {
        loadData();
    }, []);

    const redirectToChooseDoctor = (idDokter) => {
        navigation.navigate('ChooseDoctor', {
            id: idDokter
        })
    }

    return (
        <View>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw``}>Janji Temu Dokter</Text>
                <Text></Text>
            </View>

            <ScrollView style={tw`mt-4 mb-12`}>
                {dokter.map((d, index) => {
                    return (
                        <View style={tw`bg-white flex flex-row p-4 border-b border-gray-300 mb-4`} key={index}>
                            <View style={tw`w-2/6`}>
                                <Image
                                    style={[tw``, customStyle.aspectSquare, customStyle.w30]}
                                    source={{
                                        uri: baseUrl + d.foto,
                                    }}
                                />
                            </View>
                            <View style={[tw`pl-0`, customStyle.w70]}>
                                <Text style={tw`text-black`}>{d.nama}</Text>
                                {d.detail ? (
                                    <Text style={tw`text-xs text-gray-400 mb-1`}>{d.detail.specialist ? d.detail.specialist.name : "-"}</Text>
                                ) : (
                                    <Text style={tw`text-xs text-gray-400 mb-1`}>-</Text>
                                )}
                                <View style={tw`flex flex-row items-center`}>
                                    <Icon name="briefcase" size={15} color="#767272" style={tw`mr-1`} solid />
                                    <Text style={tw`text-xs`}>{d.detail ? d?.detail?.lama_kerja : "-"}</Text>
                                </View>
                                <Pressable
                                    onPress={() => redirectToChooseDoctor(d.id)}
                                    style={tw`bg-red-600 w-1/3 p-2 rounded mt-3`}
                                >
                                    <Text style={tw`text-center text-white`}>Pilih</Text>
                                </Pressable>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export default DoctorAppointment