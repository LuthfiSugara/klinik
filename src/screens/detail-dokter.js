import React from 'react'
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from "react-redux";
import { detailDokter } from '../redux/actions/dokter-actions';
import { baseUrl } from "../utils/global";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { format } from 'date-fns';

const DetailDokter = ({navigation, route}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const { id } = route.params;

    const {loading, detail_dokter} = useSelector((state) => state.dokterReducers);

    const loadData = async() => {
       await dispatch(detailDokter(id));
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
                <Text style={tw`text-lg`}>Detail Dokter</Text>
                <View></View>
            </View>

            <ScrollView>
                <View style={tw`flex flex-row justify-center bg-gray-300`}>
                    <Image source={{uri: baseUrl + detail_dokter.foto}} style={tw`h-50 w-50`} />
                </View>

                <View style={tw`mt-4`}>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-lg mb-2 px-4`}>Informasi Umum</Text>
                        <Pressable
                            onPress={redirectToEditDokter}
                            style={tw`mr-4`}
                        >
                            <Icon name="edit" size={20} color="#e91e63" style={tw`mr-1`} solid />
                        </Pressable>
                    </View>
                    <View style={tw`bg-white px-4`}>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3 text-lg`}>Nama</Text>
                            <Text style={tw`text-gray-500 text-lg`}>{detail_dokter.nama}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3 text-lg`}>Spesialis</Text>
                            <Text style={tw`text-gray-500 text-lg`}>{detail_dokter?.specialist?.name}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3 text-lg`}>Tanggal Lahir</Text>
                            <Text style={tw`text-gray-500 text-lg`}>{format( new Date(detail_dokter.tanggal_lahir), 'dd-MM-yyyy')}</Text>
                        </View>
                        
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3 text-lg`}>Jenis Kelamin</Text>
                            <Text style={tw`text-gray-500 text-lg`}>{detail_dokter.id_gender == 1 ? "Laki-laki" : "Perempuan"}</Text>
                        </View>
                    </View>

                    <Text style={tw`text-lg mb-2 px-4 mt-4`}>Informasi Lainnya</Text>
                    <View style={tw`bg-white px-4`}>
                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3 text-lg`}>Mulai Praktek</Text>
                            <Text style={tw`text-gray-500 text-lg`}>{format( new Date(detail_dokter.mulai_praktek), 'dd-MM-yyyy')}</Text>
                        </View>

                        <View style={tw`flex flex-row justify-between items-center border-b border-gray-300 mb-2 py-2`}>
                            <Text style={tw`w-1/3 text-lg`}>Biaya Konsultasi</Text>
                            <Text style={tw`text-gray-500 text-lg`}>{detail_dokter.biaya}</Text>
                        </View>
                    </View>
                </View>
                <View style={tw`mt-6 bg-white p-4`}>
                    <View style={tw`flex flex-row justify-between items-center`}>
                        <View style={tw`flex flex-row items-center`}>
                            <Icon name="question-circle" size={30} color="#9e9e9e" style={tw`mr-1`} solid />
                            <Text style={tw`text-lg`}>Detail Info</Text>
                        </View>
                        <Text>{detail_dokter.lama_kerja} Pengalaman</Text>
                    </View>

                    <View style={tw`h-96 p-4`}>
                        <WebView source={{ html: detail_dokter.keterangan }} style={tw`text-lg`} />
                    </View>
                </View>  
            </ScrollView>
        </View>
    )
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     image: {
//       flex: 1,
//       justifyContent: "center"
//     },
//     text: {
//       color: "white",
//       fontSize: 42,
//       lineHeight: 84,
//       fontWeight: "bold",
//       textAlign: "center",
//       backgroundColor: "#000000c0"
//     }
//   });

export default DetailDokter