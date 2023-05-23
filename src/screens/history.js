import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TouchableOpacity, View, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { historyAppointment, updateStatusAppointment } from '../redux/actions/appointment-actions';
import { getProfile } from '../redux/actions/auth-actions';
import { baseUrl } from '../utils/global';
import { customStyle } from '../utils/global-style';
import { BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import { formatRupiah } from '../utils/function';
import QRCode from 'react-native-qrcode-svg';

const History = ({navigation}) => {
    const dispatch = useDispatch();
    const {history_appointment} = useSelector((state) => state.appointmentReducers);
    const {profile} = useSelector((state) => state.authReducers);
    const [loadPage, setLoadPage] = useState(false);
    const [modalBarcode, setModalBarcode] = useState(false);
    const [price, setPrice] = useState("");

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

    const hideModalBarcode = () => {
        setModalBarcode(false);
    }

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
                                            <View style={tw`flex flex-row justify-end`}>
                                                <TouchableOpacity onPress={() => {
                                                    printQueue(history.nomor_urut);
                                                }} style={tw`pr-1`}>
                                                    <Text style={tw`bg-blue-500 text-white p-1 rounded`}>Antrian</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity 
                                                onPress={() => {
                                                    setPrice(history.biaya);
                                                    setModalBarcode(true);
                                                }} style={tw`pr-1`}>
                                                    <Text style={tw`bg-black text-white p-1 rounded`}>Barcode</Text>
                                                </TouchableOpacity>
                                                </View>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalBarcode}
                onRequestClose={() => {
                    setModalBarcode(false);
                }}
            >
                <View style={customStyle.centeredView}>
                    <TouchableOpacity onPress={() => {setModalBarcode(false)}} style={tw`flex flex-row justify-end w-full`}>
                        <Text style={[tw`text-right rounded-full py-3 px-4 mr-4 mb-2 text-black font-bold`, customStyle.shadow]}>X</Text>
                    </TouchableOpacity>
                    <View style={customStyle.modalView}>
                        <View style={tw`flex flex-row justify-center mt-4`}>
                            <QRCode value={price} />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

export default History