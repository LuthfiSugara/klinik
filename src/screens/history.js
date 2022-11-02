import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { historyAppointment, updateStatusAppointment } from '../redux/actions/appointment-actions';
import { getProfile } from '../redux/actions/auth-actions';
import { baseUrl } from '../utils/global';
import { customStyle } from '../utils/global-style';
import { BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { formatRupiah } from '../utils/function';

const History = ({navigation}) => {
    const dispatch = useDispatch();
    const {history_appointment} = useSelector((state) => state.appointmentReducers);
    const {profile} = useSelector((state) => state.authReducers);
    const [loadPage, setLoadPage] = useState(false);

    const loadData = async() => {
       await dispatch(historyAppointment());
       await dispatch(getProfile());
    }

    const updateStatus = (id, id_status) => {
        dispatch(updateStatusAppointment(id, id_status))
            .then(response => {
                if(response.status === "success"){
                    setLoadPage(true);
                    loadData();
                    setLoadPage(false);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        loadData();
    }, []);

    const printPayment = async(nominal) => {
        nominal = formatRupiah(nominal);
        try {
            await BluetoothEscposPrinter.printText('\r\n\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Klinik Yazid'],
                {},
            );
            await BluetoothEscposPrinter.printText('\r', {});
            await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Jl. Musyawarah No. 71 Saentis'],
                {},
            );
            await BluetoothEscposPrinter.printText('\r', {});
            await BluetoothEscposPrinter.printText(
                '================================',
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(
                'Struk Pembayaran',
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(
                '================================',
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Biaya', nominal],
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printText(
                '================================',
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [16, 16],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Total ', nominal],
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Terima Kasih'],
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
        }catch(e){
            alert(e.message || 'ERROR');
        }
    }

    const printQueue = async(queue) => {
        try {
            await BluetoothEscposPrinter.printText('\r\n\r\n', {});
            await BluetoothEscposPrinter.printText(String("NOMOR ANTRIAN ANDA\r\n\r\n"), {});
            await  BluetoothEscposPrinter.printText(String(queue),{
                encoding:'GBK',
                codepage:0,
                widthtimes:1,
                heigthtimes:1,
                fonttype:8
              });
            await BluetoothEscposPrinter.printText('\r\n\r\n', {});
            await BluetoothEscposPrinter.printText(`${format(new Date(), 'dd/MM/yyyy')} ${'\r\n'}`, {});
            await BluetoothEscposPrinter.printText('\r\n\r\n', {});
        }catch(e){
            alert(e.message || 'ERROR');
        }
    }

    return loadPage ? (
        <View style={tw`flex flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#ff1402" />
            <Text style='text-center'>Loading....</Text>
        </View>
    ) : (
        <View style={tw`h-full ${history_appointment.length < 1 ? "bg-white" : ""}`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw``}>History Pasien</Text>
                <Text></Text>
            </View>

            <ScrollView>
                <View style={tw`p-4`}>
                    {history_appointment.length > 0 ? (
                        history_appointment.map((history, index) => {
                            return (
                                <View style={tw`mb-4`} key={index}>
                                    <View style={tw`flex flex-row justify-between items-center`}>
                                        <Text style={tw`text-lg text-gray-700`}>{format(new Date(history.created_at), 'dd/MM/yyyy')}</Text>
                                        {/* <Text style={tw`${history.status.id == 1 || history.status.id == 4 ? 'text-green-500' : history.status.id == 2 ? 'text-yellow-500' : 'text-red-500'} rounded`}>{history.status.name}</Text> */}
                                    </View>
                                    <Text>|</Text>
                                    <Text>|</Text>
                                    <View style={tw`bg-white py-4 rounded-lg`}>
                                        <View style={tw`flex flex-row justify-between`}>
                                            <View>
                                                <Text style={tw`text-gray-500 px-2`}>Janji kunjungan pada</Text>
                                                <Text style={tw`px-2`}>{format(new Date(history.tanggal_berkunjung), 'dd/MM/yyyy HH:mm:ss')}</Text>
                                            </View>
                                            {/* {profile.id_level == 1 ? ( */}
                                                <TouchableOpacity onPress={() => {
                                                    printQueue(history.nomor_urut);
                                                }} style={tw`px-2`}>
                                                    <Text style={tw`bg-blue-500 text-white p-2 rounded`}>Cetak Antrian</Text>
                                                </TouchableOpacity>
                                            {/* ) : (
                                                null
                                            )} */}
                                        </View>
                                        <View style={tw`flex flex-row items-center`}>
                                            <View style={tw`p-4`}>
                                                <Image
                                                    style={tw`w-20 h-20 rounded-full mr-4`}
                                                    source={require('../assets/images/first-aid-kit.png')}
                                                />
                                            </View>
                                            <View style={tw`flex flex-col`}>
                                                <View style={tw`flex flex-row`}>
                                                    <Text>{history.diagnosa}</Text>
                                                </View>
                                                <View style={tw`flex flex-row mt-2`}>
                                                    {/* {history.status.id == 2 
                                                    && history.id_user == profile.id
                                                    &&  */}
                                                    {/* <TouchableOpacity onPress={() => {
                                                        Alert.alert(
                                                            "Batalkan Kunjungan",
                                                            "Apakah anda yakin ?",
                                                            [
                                                                { text: "Tidak" },
                                                                { text: "Ya", onPress: () => {
                                                                    updateStatus(history.id, 3)
                                                                }}
                                                            ]
                                                        )}
                                                    } 
                                                    style={tw`bg-red-500 py-2 px-4 mx-1 rounded`}>
                                                            <Text style={tw`text-white text-center`}>Batal</Text>
                                                        </TouchableOpacity> */}
                                                    {/* } */}
                                                    
                                                    {/* {history.status.id == 2 ? (
                                                        history.id_dokter == profile.id
                                                        || profile.id_level == 1 ? ( */}
                                                            {/* <TouchableOpacity onPress={() => {
                                                                Alert.alert(
                                                                    "Konfirmasi Kunjungan",
                                                                    "Apakah anda yakin ?",
                                                                    [
                                                                        { text: "Tidak" },
                                                                        { text: "Ya", onPress: () => {
                                                                            updateStatus(history.id, 4)
                                                                        }}
                                                                    ]
                                                                )}
                                                            } style={tw`bg-green-500 py-2 px-4 mx-1 rounded`}>
                                                                <Text style={tw`text-white text-center`}>Konfirmasi</Text>
                                                            </TouchableOpacity> */}
                                                        {/* ) : (
                                                            null
                                                        )
                                                    ) : (
                                                        null
                                                    )} */}

                                                    {/* {history.status.id === 4 ? (
                                                        profile.id == history.id_dokter
                                                        || profile.id_level == 1  ? ( */}
                                                            {/* <TouchableOpacity onPress={() => {
                                                                Alert.alert(
                                                                    "Kunjungan Selesai",
                                                                    "Apakah anda yakin ?",
                                                                    [
                                                                        { text: "Tidak" },
                                                                        { text: "Ya", onPress: () => {
                                                                            updateStatus(history.id, 1)
                                                                        }}
                                                                    ]
                                                                )}
                                                            } style={tw`bg-green-500 py-2 px-4 mx-1 rounded`}>
                                                                <Text style={tw`text-white text-center`}>Selesai</Text>
                                                            </TouchableOpacity> */}
                                                        {/* ) : (
                                                            null
                                                        )
                                                    ) : (
                                                        null
                                                    )} */}

                                                    {/* {profile.id_level == 1 && history.status.id == 1 &&  */}
                                                        {/* <TouchableOpacity onPress={() => printPayment(history?.dokter?.detail?.biaya)} 
                                                        style={tw`bg-green-500 py-2 px-4 mx-1 rounded`}>
                                                            <Text style={tw`text-white text-center`}>Cetak Pembayaran</Text>
                                                        </TouchableOpacity> */}
                                                    {/* } */}
                                                </View>
                                            </View>
                                        </View>
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
                            <Text style={tw`text-black text-center text-lg`}>Belum ada riwayat kunjungan</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default History