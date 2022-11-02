import { format } from 'date-fns';
import React, { useEffect } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import Loader from '../components/loader';
import NotFound from '../components/not-found';
import { getQueueAppointment } from '../redux/actions/appointment-actions';
import { customStyle } from '../utils/global-style';

const Queue = ({navigation, route}) => {
    const dispatch = useDispatch();
    const {id_dokter, date} = route.params;

    const {load_appointment, queue} = useSelector((state) => state.appointmentReducers);

    const loadData = async() => {
        await dispatch(getQueueAppointment(id_dokter, date));
    }

    useEffect(() => {
        loadData();
    }, []);

    return load_appointment ? (
        <Loader/>
    ) : (
        <View style={tw`bg-white h-full pb-8`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>List Antrian</Text>
                <Text></Text>
            </View>
            {queue.length > 0 ? (
                <ScrollView>
                    <View style={tw`p-4`}>
                        <Text style={tw`mb-1`}>Waktu :  {format(new Date(date), 'dd/MM/yyyy HH:mm')}</Text>
                        {queue.length < 10 ? (
                            <View style={tw`flex flex-row`}>
                                <Text>Sisa kuota antrian </Text>
                                <Text style={tw`text-black font-bold`}>{10 - queue.length} </Text>
                                <Text>dari</Text>
                                <Text style={tw`text-black font-bold`}> 10</Text>
                            </View>

                        ) : (
                            <Text style={tw`bg-red-500 text-white p-2 rounded font-bold`}>Kuota antrian sudah penuh</Text>
                        )}
                    </View>
                    
                        {queue.map((queue, index) => {
                            return (
                                <View key={index} style={tw`flex flex-row mx-4 my-2 border border-gray-300 rounded-lg`}>
                                    <View style={tw`w-18 mr-2`}>
                                        <Image 
                                            style={[tw`w-15 h-15 rounded m-2`, customStyle.aspectSquare]}
                                            source={require('../assets/images/doctor.jpg')}
                                        />
                                    </View>
                                    <View style={tw`self-center`}>
                                        <Text style={tw`text-black text-lg font-bold`}>{queue.user.nama}</Text>
                                        <Text style={tw`text-gray-500 text-xs`}>No Antrian {index + 1}</Text>
                                    </View>
                                </View>
                            )
                        })}    
                </ScrollView>
            ) : (
                <NotFound message="Belum ada antrian" />
            )}
        </View>
    )
}

export default Queue