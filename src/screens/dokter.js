import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from "react-redux";
import { getDokter } from "../redux/actions/dokter-actions";
import { baseUrl } from "../utils/global";
import { customStyle } from "../utils/global-style";
import { useIsFocused } from "@react-navigation/native";

const Dokter = ({navigation}) => {

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const {loading, dokter} = useSelector((state) => state.dokterReducers);

    const loadData = async() => {
       await dispatch(getDokter());
    }

    useEffect(() => {
        loadData();
    }, [isFocused]);

    const redirectToDetailDokter = (idDokter) => {
        navigation.navigate('DetailDokter', {
            id: idDokter
        })
    }

    return (
        <View>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-lg`}>Daftar Dokter</Text>
                <Pressable onPress={() => navigation.navigate('AddDokter')}>
                    <Icon name="user-plus" size={20} color="#D61C4E" style={tw`mr-1`} solid />
                </Pressable>
            </View>

            <ScrollView style={tw`mt-4 mb-12`}>
                    {dokter.map((d, index) => {
                        return (
                            <View style={tw`bg-white flex flex-row p-4 border-b border-gray-300 mb-4`} key={index}>
                                <View style={tw`w-2/6`}>
                                    <Image
                                        style={[tw`w-11/12 h-42`, customStyle.aspectSquare]}
                                        source={{
                                            uri: baseUrl + d.foto,
                                        }}
                                    />
                                </View>
                                <View style={tw`w-4/6 pl-4`}>
                                    <Text style={tw`text-xl text-black`}>{d.nama}</Text>
                                    <Text style={tw`text-gray-400 mb-1`}>{d.specialist.name}</Text>
                                    <View style={tw`flex flex-row items-center`}>
                                        <Icon name="briefcase" size={20} color="#767272" style={tw`mr-1`} solid />
                                        <Text>{d.lama_kerja}</Text>
                                    </View>
                                    <Pressable
                                        onPress={() => redirectToDetailDokter(d.id)}
                                        style={tw`bg-red-600 w-1/3 p-2 rounded mt-3`}
                                    >
                                        <Text style={tw`text-center text-white`}>Detail</Text>
                                    </Pressable>
                                </View>
                            </View>
                        )
                    })}
            </ScrollView>
        </View>
    )
}

export default Dokter;