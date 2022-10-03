import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import tw from 'twrnc';
import * as Yup from "yup";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getGender } from "../redux/actions/setting-actions";
import { getProfile, updateProfile } from "../redux/actions/auth-actions";
import {launchImageLibrary} from 'react-native-image-picker';
import { baseUrl } from "../utils/global";

const options = {
    title: "Select Image",
    type: 'library',
    options: {
        mediaType: 'photo',
        maxWidth: 200,
        maxHeight: 200,
        includeBase64: false,
        selectionLimit: 1,
    }
}

const Profile = ({navigation}) => {
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date(format(new Date(), 'yyyy'), format(new Date(), 'M') - 1, format(new Date(), 'd')));
    // const [gender, setGender] = useState("");
    const [foto, setFoto] = useState(null);
    const [showPassword, setShowPassword] = useState(true);
    const [previewImage, setPreviewImage] = useState();

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            nama: '',
            password: '',
            tanggal_lahir: '',
            id_gender: '',
            no_hp: '',
            berat_badan: '',
            tinggi_badan: '',
        },
        onSubmit: values => {
            const formData = new FormData();
            formData.append('nama', values.nama);
            formData.append('password', values.password);
            formData.append('tanggal_lahir', values.tanggal_lahir);
            formData.append('id_gender', values.id_gender);
            formData.append('no_hp', values.no_hp);
            formData.append('berat_badan', values.berat_badan);
            formData.append('tinggi_badan', values.tinggi_badan);

            if(values.password){
                console.log("pass OK");
                formData.append('password', values.password);
            }

            if(foto){
                formData.append('foto', {
                    uri: foto.assets[0].uri,
                    type: foto.assets[0].type,
                    name: foto.assets[0].fileName,
                });
            }
            
            dispatch(updateProfile(formData))
            .then(response => {
                if(response.status === "success"){
                    navigation.navigate('Home');
                }
            })
        },
        validationSchema: Yup.object().shape({
            nama: Yup
                .string()
                .required("Tidak boleh kosong!"),
            password: Yup
                .string()
                .min(6, "Minimal 6 karakter"),
            tanggal_lahir: Yup
                .string()
                .required("Tidak boleh kosong"),
            no_hp: Yup
                .string()
                .required("Tidak boleh kosong"),
            berat_badan: Yup
                .string()
                .required("Tidak boleh kosong"),
            tinggi_badan: Yup
                .string()
                .required("Tidak boleh kosong"),
        }),
    });

    const onChange = (event, selectedDate) => {
        setDate(selectedDate);
        setFieldValue('tanggal_lahir', format(new Date(selectedDate), 'yyyy/MM/dd'));
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
            maximumDate: new Date(format(new Date(), 'yyyy'), format(new Date(), 'M') - 1, format(new Date(), 'd'))
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const {loading: loadingAuth, profile} = useSelector((state) => state.authReducers);
    const {loading, jk} = useSelector((state) => state.settingReducers);

    const loadData = async() => {
       await dispatch(getGender());
       await dispatch(getProfile());
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setFieldValue('nama', profile.nama);
        setFieldValue('tanggal_lahir', format(new Date(profile.tanggal_lahir), 'yyyy/M/dd'));
        setFieldValue('id_gender', profile.id_gender);
        setFieldValue('no_hp', profile.no_hp);
        setFieldValue('berat_badan', profile.berat_badan);
        setFieldValue('tinggi_badan', profile.tinggi_badan);
        setPreviewImage(baseUrl + profile.foto);
    }, [profile]);

    const openGallery = async () => {
        const images = await launchImageLibrary(options);
        setFoto(images);
        console.log("foto : ", images.assets[0].uri);
        setPreviewImage(images.assets[0].uri);
    }

    const changeIconPassword = () => {
        showPassword === false ? setShowPassword(true) : setShowPassword(false);
    }

    return (
        <View style={tw`bg-white h-full pb-8`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>Profil Pengguna</Text>
                <Text></Text>
            </View>
            <ScrollView>
                <View>
                    <Text style={tw`bg-gray-100 px-4 py-2 text-black`}>Informasi Umum</Text>
                    <View style={tw`bg-white px-4`}>
                        <Text style={tw`mt-4 mb-1 text-black`}>Nama Lengkap</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded text-black`}
                            onChangeText={(nama) => setFieldValue('nama', nama)}
                            value={values.nama}
                            placeholder="nama"
                        />
                        {errors.nama && touched.nama ? (
                            <Text style={tw`text-red-500`}>{errors.nama}</Text>
                        ) : null}

                        <Text style={tw`mt-4 mb-1 text-black`}>Tanggal Lahir</Text>
                        <Pressable onPress={showDatepicker} style={tw`border border-gray-300 rounded`}>
                            <Text style={tw`p-4 text-black`}>{values.tanggal_lahir ? format(new Date(date), 'dd/MM/yyyy') : ""}</Text>
                        </Pressable>
                        {errors.tanggal_lahir && touched.tanggal_lahir ? (
                            <Text style={tw`text-red-500`}>{errors.tanggal_lahir}</Text>
                        ) : null}

                        <Text style={tw`mt-4 mb-4 text-black`}>Jenis Kelamin</Text>
                        <View style={tw`flex flex-row justify-between`}>
                            {jk.map((jkUser, index) => {
                                return (
                                    <View style={tw`flex flex-row justify-center w-1/2`} key={index}>
                                        {values.id_gender == jkUser.id ? 
                                            <Icon style={tw`self-center mr-2`} name="dot-circle" size={20} color="#e91e63" /> :
                                            <Icon style={tw`self-center mr-2`} name="circle" size={20} color="#9e9e9e" onPress={() => {
                                                setFieldValue('id_gender', jkUser.id);
                                            }} />
                                        }
                                        <Text style={tw`font-semibold text-black`}>{jkUser.name}</Text>
                                    </View>
                                )
                            })}
                        </View>
                        
                        <Text style={tw`mt-6 text-black`}>Foto Profile</Text>
                        <TouchableOpacity style={tw`mt-6 pb-4`} onPress={openGallery}>
                            <View style={tw`w-full flex flex-row justify-center`}>
                                <Image
                                    style={tw`w-1/3 h-42`}
                                    source={{
                                        uri: previewImage,
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <Text style={tw`bg-gray-100 px-4 py-2 text-black`}>Informasi Keamanan</Text>
                    <View style={tw`px-4 pb-4`}>
                        <Text style={tw`mt-4 mb-1 text-black`}>Password</Text>
                        <View style={tw`flex flex-row border border-gray-300 rounded`}>
                            <TextInput
                                style={tw`w-11/12 h-12 px-4 text-black`}
                                onChangeText={(password) => setFieldValue('password', password)}
                                value={values.password}
                                placeholder="******"
                                secureTextEntry={showPassword}
                            />
                            <Icon style={tw`w-1/12 self-center`} name={showPassword ? "eye-slash" : "eye"} size={15} color="#9e9e9e" onPress={changeIconPassword} />
                        </View>
                        {errors.password && touched.password ? (
                            <Text style={tw`text-red-500`}>{errors.password}</Text>
                        ) : null}
                    </View>
                </View>

                <View>
                    <Text style={tw`bg-gray-100 px-4 py-2 text-black`}>Informasi Kontak</Text>
                    <View style={tw`px-4 pb-4`}>
                        <Text style={tw`mt-4 mb-1`}>Nomor Handphone</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded text-black`}
                            onChangeText={(phone) => setFieldValue('no_hp', phone)}
                            value={values.no_hp}
                            placeholder="08*****"
                            keyboardAppearance="number-pad"
                        />
                        {errors.no_hp && touched.no_hp ? (
                            <Text style={tw`text-red-500`}>{errors.no_hp}</Text>
                        ) : null}

                        <Text style={tw`mt-4 mb-1`}>Email</Text>
                        <Text style={tw`border border-gray-300 rounded p-3 text-black`}>{profile.email}</Text>
                    </View>
                </View>

                <View>
                    <Text style={tw`bg-gray-100 px-4 py-2 text-black`}>Informasi Tambahan</Text>
                    <View style={tw`px-4`}>
                        <Text style={tw`mt-4 mb-1 text-black`}>Berat Badan</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded text-black`}
                            onChangeText={(event) => setFieldValue('berat_badan', event)}
                            value={values.berat_badan}
                            placeholder="0"
                            keyboardAppearance="number-pad"
                        />
                        {errors.berat_badan && touched.berat_badan ? (
                            <Text style={tw`text-red-500`}>{errors.berat_badan}</Text>
                        ) : null}

                        <Text style={tw`mt-4 mb-1 text-black`}>Tinggi Badan</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded text-black`}
                            onChangeText={(event) => setFieldValue('tinggi_badan', event)}
                            value={values.tinggi_badan}
                            placeholder="0"
                            keyboardAppearance="number-pad"
                        />
                        {errors.tinggi_badan && touched.tinggi_badan ? (
                            <Text style={tw`text-red-500`}>{errors.tinggi_badan}</Text>
                        ) : null}
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity 
                onPress={handleSubmit}
                style={tw`bg-red-600 p-3 rounded-full mt-6 mx-4`}
            >
                <Text style={tw`text-white text-center`}>Simpan</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile;