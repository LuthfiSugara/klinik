import React, { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { baseUrl } from '../utils/global';
import { useDispatch, useSelector } from 'react-redux';
import { detailDokter } from '../redux/actions/dokter-actions';
import { getProfile } from '../redux/actions/auth-actions';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { format } from 'date-fns';
import { addAppointment } from '../redux/actions/appointment-actions';
import { formatRupiah } from '../utils/function';


const ChooseDoctor = ({navigation, route}) => {
    const {id} = route.params;
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date(format(new Date(), 'yyyy'), format(new Date(), 'M') - 1, format(new Date(), 'd')));

    const {loading, detail_dokter} = useSelector((state) => state.dokterReducers);
    const {profile} = useSelector((state) => state.authReducers);

    const loadData = async() => {
       await dispatch(detailDokter(id));
       await dispatch(getProfile());
    }

    useEffect(() => {
        loadData();
    }, []);

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            id_user: profile.id,
            id_dokter: detail_dokter.id,
            tanggal_berkunjung: format(new Date(), 'yyyy/MM/dd'),
            jam_berkunjung: '',
            diagnosa: '',
        },
        onSubmit: values => {
            values.id_dokter = detail_dokter.id;
            console.log("values : ", values);
            
            dispatch(addAppointment(values))
            .then(response => {
                if(response.status === "success"){
                    navigation.goBack();
                }
            })
        },
        validationSchema: Yup.object().shape({
            tanggal_berkunjung: Yup
                .string()
                .required("Tidak boleh kosong!"),
            jam_berkunjung: Yup
                .string()
                .required("Tidak boleh kosong!"),
            diagnosa: Yup
                .string()
                .required("Tidak boleh kosong!"),
        }),
    });

    const onChange = (event, selectedDate) => {
        setDate(selectedDate);
        setFieldValue('tanggal_berkunjung', format(new Date(selectedDate), 'yyyy/MM/dd'));
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View style={`bg-white h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw``}>Buat Janji</Text>
                <Text></Text>
            </View>

            <ScrollView style={tw`mb-20`}>
                <View>
                    <View style={tw`flex flex-row justify-center bg-gray-300`}>
                        <Image source={{uri: baseUrl + detail_dokter.foto}} style={tw`h-50 w-50`} />
                    </View>

                    <View style={tw`bg-white p-4`}>
                        <Text style={tw`text-black mb-1`}>Nama : {detail_dokter.nama}</Text>
                        <Text style={tw`mb-1`}>Spesialis : {detail_dokter?.detail?.specialist?.name}</Text>
                        <View style={tw`flex flex-row items-center pb-2 mb-4 border-b border-gray-300`}>
                            <Icon name="briefcase" size={20} color="#767272" style={tw`mr-1`} solid />
                            <Text>{detail_dokter?.detail?.lama_kerja ? detail_dokter?.detail?.lama_kerja : ""}</Text>
                        </View>
                        <Text style={tw`text-red-500`}>Bayar di Klinik</Text>
                        <Text style={tw`text-black text-lg`}>Rp. {detail_dokter?.detail?.biaya ? formatRupiah(detail_dokter?.detail?.biaya) : ""}</Text>
                    </View>

                    <View style={tw`bg-gray-200 p-4`}>
                        <Text style={tw`text-black mb-2`}>Pilih Tanggal dan waktu kunjungan</Text>

                        <Pressable onPress={showDatepicker} style={tw`bg-white border border-gray-300 rounded`}>
                            <Text style={tw`p-4`}>{values.tanggal_berkunjung ? format(new Date(date), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}</Text>
                        </Pressable>
                        {errors.tanggal_berkunjung && touched.tanggal_berkunjung ? (
                            <Text style={tw`text-red-500`}>{errors.tanggal_berkunjung}</Text>
                        ) : null}

                        <View style={tw`py-4 px-2 flex flex-row flex-wrap justify-start`}>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '09:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '09:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>09:00</Text>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '10:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '10:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>10:00</Text>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '11:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '11:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>11:00</Text>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '13:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '13:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>13:00</Text>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '14:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '14:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>14:00</Text>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '15:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '15:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>15:00</Text>
                            <Text onPress={() => setFieldValue('jam_berkunjung', '16:00')} style={tw`p-3 rounded-lg m-4 border ${values.jam_berkunjung == '16:00' ? 'bg-red-500 border-white text-white' : 'bg-white border-gray-500' }`}>16:00</Text>
                        </View>
                        {errors.jam_berkunjung && touched.jam_berkunjung ? (
                            <Text style={tw`text-red-500`}>{errors.jam_berkunjung}</Text>
                        ) : null}
                    </View>
                    
                    <View style={tw`mx-4`}>
                        <Text style={tw`mt-4`}>Keterangan</Text>
                        <TextInput
                            style={tw`border border-gray-300 rounded bg-white my-2 p-4`}
                            onChangeText={(e) => setFieldValue('diagnosa', e)}
                            value={values.diagnosa}
                            placeholder="Diagnosa Penyakit"
                            multiline
                            numberOfLines={6}
                        />
                        {errors.jam_berkunjung && touched.jam_berkunjung ? (
                            <Text style={tw`text-red-500`}>{errors.jam_berkunjung}</Text>
                        ) : null}
                    </View>
                </View>
                <TouchableOpacity onPress={handleSubmit} style={tw`bg-red-500 m-4 p-3 rounded-lg mt-8`}>
                    <Text style={tw`text-white text-center`}>Buat Janji</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default ChooseDoctor