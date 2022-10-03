import React, { useEffect, useState } from 'react'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { getDokter } from "../redux/actions/dokter-actions";
import { getProfile } from '../redux/actions/auth-actions';
import { useDispatch, useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import { createConsultation } from '../redux/actions/consultation-actions';

const AddConsultation = ({navigation}) => {
    const dispatch = useDispatch();

    const [loadPage, setLoadPage] = useState(false);

    const {dokter} = useSelector((state) => state.dokterReducers);
    const {profile} = useSelector((state) => state.authReducers);

    const loadData = async() => {
        await dispatch(getProfile());
        await dispatch(getDokter());
    }

    useEffect(() => {
        loadData();
    }, []);

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            consultation: '',
            id_dokter: dokter.length > 0 ? dokter[0].id : "",
            id_user: profile.id,
        },
        onSubmit: values => {
            console.log("values : " , values);

            dispatch(createConsultation(values))
            .then(response => {
                if(response.status === "success"){
                    setLoadPage(true);
                    navigation.goBack();
                }
            })
            .catch(err => console.log(err));
        },
        validationSchema: Yup.object().shape({
            consultation: Yup
                .string()
                .required("Tidak boleh kosong!"),
        }),
    });

    return loadPage ? (
        <View style={tw`flex flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#ff1402" />
            <Text style='text-center'>Loading....</Text>
        </View>
    ) : (
        <View style={tw`bg-white h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>Tambah Konsultasi</Text>
                <View></View>
            </View>

            <ScrollView>
                <View style={tw`mt-4`}>
                    <View style={tw`mb-4`}>
                        <Text style={tw`px-4`}>Pilih Dokter</Text>
                        <Picker
                            style={tw`bg-gray-200 mx-4 rounded`}
                            selectedValue={values.id_dokter}
                            onValueChange={(itemValue, itemIndex) =>
                                setFieldValue('id_dokter', itemValue)
                            }>
                                {dokter.map((dokter, index) => {
                                    return (
                                        <Picker.Item label={dokter.nama} value={dokter.id} key={index} style={tw`text-black`} />
                                    )
                                })}
                        </Picker> 
                        {errors.id_dokter && touched.id_dokter ? (
                            <Text style={tw`text-xs text-red-500`}>{errors.id_dokter}</Text>
                        ) : null}
                    </View>
                    <View style={tw`mx-4`}>
                        <Text style={tw`mb-1`}>Keterangan</Text>
                        <TextInput
                            multiline
                            numberOfLines={4}
                            onChangeText={e => setFieldValue('consultation', e)}
                            value={values.consultation}
                            style={tw`border border-gray-300 bg-white rounded p-4`}
                        />
                        {errors.consultation && touched.consultation ? (
                            <Text style={tw`text-xs text-red-500`}>{errors.consultation}</Text>
                        ) : null}
                    </View>

                </View>
            </ScrollView>

            <TouchableOpacity onPress={handleSubmit} style={tw`mb-4 bg-white mx-4`}>
                <Text style={tw`bg-red-500 text-white text-center rounded p-3`}>Tambah</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AddConsultation