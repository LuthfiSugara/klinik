import React from 'react'
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from "react-redux";
import { detailDokter } from '../redux/actions/dokter-actions';
import { baseUrl } from "../utils/global";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { format } from 'date-fns';
import { formatRupiah } from '../utils/function';
import { getProfile } from '../redux/actions/auth-actions';

const DetailDokter = ({navigation, route}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const { id } = route.params;

    const {loading, detail_dokter} = useSelector((state) => state.dokterReducers);
    const {profile} = useSelector((state) => state.authReducers);

    const loadData = async() => {
       await dispatch(detailDokter(id));
       await dispatch(getProfile());
    }

    useEffect(() => {
        loadData();
    }, [isFocused]);

    const redirectToEditDokter = () => {
        navigation.navigate('EditDokter', {
            idDokter: id
        });
    }

    return (
        <View style={tw`h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw``}>Detail Dokter</Text>
                <View></View>
            </View>

            <ScrollView>
                <View style={tw`flex flex-row justify-center bg-gray-300`}>
                    <Image source={{uri: baseUrl + detail_dokter.foto}} style={tw`h-50 w-50`} />
                </View>

                <View style={tw`mt-4`}>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`mb-2 px-4 py-1`}>Informasi Umum</Text>
                        {profile.id == detail_dokter.id || profile.id_level == 1 ? (
                            <TouchableOpacity
                                onPress={redirectToEditDokter}
                                style={tw`mr-4`}
                            >
                                <Text style={tw`bg-green-500 text-white px-2 py-1 rounded`}>Edit</Text>
                            </TouchableOpacity>
                        ) : (
                            null
                        )}
                    </View>
                    <View style={tw`bg-white px-4`}>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Nama</Text>
                            <Text style={tw`text-gray-500`}>{detail_dokter.nama}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Email</Text>
                            <Text style={tw`text-gray-500`}>{detail_dokter.email}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Spesialis</Text>
                            <Text style={tw`text-gray-500`}>{detail_dokter?.detail?.specialist?.name}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Tanggal Lahir</Text>
                            <Text style={tw`text-gray-500`}>{detail_dokter.tanggal_lahir ? format( new Date(detail_dokter.tanggal_lahir), 'dd/MM/yyyy') : ""}</Text>
                        </View>
                        
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Jenis Kelamin</Text>
                            <Text style={tw`text-gray-500`}>{detail_dokter.id_gender == 1 ? "Laki-laki" : "Perempuan"}</Text>
                        </View>
                    </View>

                    <Text style={tw`mb-2 px-4 mt-4`}>Informasi Lainnya</Text>
                    <View style={tw`bg-white px-4`}>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Lama Praktek</Text>
                            {/* <Text style={tw`text-gray-500`}>{detail_dokter.detail.lama_kerja ? detail_dokter?.detail?.lama_kerja : ""}</Text> */}
                        </View>

                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3`}>Biaya Konsultasi</Text>
                            <Text style={tw`text-gray-500`}>Rp. {detail_dokter?.detail?.biaya ? formatRupiah(detail_dokter?.detail?.biaya) : ""}</Text>
                        </View>
                    </View>
                </View>
                <View style={tw`mt-6 bg-white p-4`}>
                    <View style={tw`flex flex-row justify-between items-center`}>
                        <View style={tw`flex flex-row items-center`}>
                            <Icon name="question-circle" size={20} color="#9e9e9e" style={tw`mr-1`} solid />
                            <Text style={tw``}>Detail Info</Text>
                        </View>
                        {/* <Text>{detail_dokter.detail.lama_kerja ? detail_dokter?.detail?.lama_kerja : ""} Pengalaman</Text> */}
                    </View>

                    {/* <View style={tw`h-96 py-4`}>
                        <WebView source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${detail_dokter?.detail?.keterangan}</body></html>` }}/>
                    </View> */}
                </View>  
            </ScrollView>
        </View>
    )
}

export default DetailDokter