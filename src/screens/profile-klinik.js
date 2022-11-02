import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from 'twrnc';

const ProfileKlinik = ({navigation}) => {
    return (
        <View style={tw`bg-white h-full pb-8`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw``}>Profile Klinik</Text>
                <Text></Text>
            </View>
            <View>
                <View style={tw`w-full flex flex-row justify-center`}>
                    <Image
                        style={[tw`w-1/2 h-42`]}
                        source={require('../assets/images/klinik.jpg')}
                    />
                </View>
                <ScrollView style={tw`px-4 my-8`}>
                    <View style={tw`flex flex-row p-2 bg-gray-300`}>
                        <Text style={tw`w-1/2`}>Nama Klinik</Text>
                        <Text style={tw`w-1/2`}>Yazid</Text>
                    </View>
                    <View style={tw`flex flex-row p-2`}>
                        <Text style={tw`w-1/2`}>Kode Klinik</Text>
                        <Text style={tw`w-1/2`}>K1212017</Text>
                    </View>
                    <View style={tw`flex flex-row p-2 bg-gray-300`}>
                        <Text style={tw`w-1/2`}>Tgl Registrasi</Text>
                        <Text style={tw`w-1/2`}>-</Text>
                    </View>
                    <View style={tw`flex flex-row p-2`}>
                        <Text style={tw`w-1/2`}>Jenis Klinik</Text>
                        <Text style={tw`w-1/2`}>Pratama</Text>
                    </View>
                    <View style={tw`flex flex-row p-2 bg-gray-300`}>
                        <Text style={tw`w-1/2`}>Alamat</Text>
                        <Text style={tw`w-1/2`}>Jl. Musyawarah No.71 Saentis</Text>
                    </View>
                    <View style={tw`flex flex-row p-2`}>
                        <Text style={tw`w-1/2`}>Kota</Text>
                        <Text style={tw`w-1/2`}>Deli Serdang</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default ProfileKlinik