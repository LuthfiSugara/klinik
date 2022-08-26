import { format } from 'date-fns';
import React, { useEffect } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { historyAppointment } from '../redux/actions/appointment-actions';

const History = ({navigation}) => {
    const dispatch = useDispatch();
    const {history_appointment} = useSelector((state) => state.appointmentReducers);

    const loadData = async() => {
       await dispatch(historyAppointment());
    }

    useEffect(() => {
        loadData();
    }, []);
    console.log("history : ", history_appointment);
    return (
        <View style={tw`h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-lg`}>History Pasien</Text>
                <Text></Text>
            </View>

            <ScrollView>
                <View style={tw`p-4`}>
                    {history_appointment.map((history, index) => {
                        return (
                            <View style={tw`mb-4`} key={index}>
                                <Text style={tw`text-xl text-gray-700`}>{format(new Date(history.created_at), 'd/MM/yyyy')}</Text>
                                <Text>|</Text>
                                <Text>|</Text>
                                <View style={tw`bg-white py-4 rounded-lg`}>
                                    <Text style={tw`text-gray-500 text-lg`}>Janji kunjungan pada</Text>
                                    <Text>{format(new Date(history.tanggal_berkunjung), 'dd/MM/yyyy HH:mm:ss')}</Text>
                                    <View style={tw`flex flex-row items-center`}>
                                        <View style={tw`p-4`}>
                                            <Image
                                                style={tw`w-20 h-20 rounded-full mr-4`}
                                                source={require('../assets/images/first-aid-kit.png')}
                                            />
                                        </View>
                                        <View>
                                            <Text>{history.diagnosa}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </View>
    )
}

export default History