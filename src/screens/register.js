import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { getGender } from "../redux/actions/setting-actions";
import { register } from "../redux/actions/auth-actions";
import {launchImageLibrary} from 'react-native-image-picker';
import { customStyle } from "../utils/global-style";

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

const Register = ({navigation}) => {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(true);
    const [gender, setGender] = useState("");
    const [foto, setFoto] = useState(null);
    const [date, setDate] = useState(new Date(format(new Date(), 'yyyy'), format(new Date(), 'M') - 1, format(new Date(), 'd')));

    const changeIconPassword = () => {
        showPassword === false ? setShowPassword(true) : setShowPassword(false);
    }

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            nama: '',
            email: '',
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
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('tanggal_lahir', values.tanggal_lahir);
            formData.append('id_gender', values.id_gender);
            formData.append('no_hp', values.no_hp);
            formData.append('berat_badan', values.berat_badan);
            formData.append('tinggi_badan', values.tinggi_badan);
            formData.append('id_level', 2);
            if(foto){
                formData.append('foto', {
                    uri: foto.assets[0].uri,
                    type: foto.assets[0].type,
                    name: foto.assets[0].fileName,
                });
            }
            console.log("form",formData);
            dispatch(register(formData))
            .then(response => {
                console.log('res register : ', response.data);
                if(response.status === "success"){
                    navigation.navigate('Login');
                }
            })
        },
        validationSchema: Yup.object().shape({
            nama: Yup
                .string()
                .required("Tidak boleh kosong!"),
            email: Yup
                .string()
                .required("Tidak boleh kosong!")
                .email('format email salah'),
            password: Yup
                .string()
                .min(6, "Minimal 6 karakter")
                .required("Tidak boleh kosong"),
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

    const {loading, jk} = useSelector((state) => state.settingReducers);

    const loadData = async() => {
       await dispatch(getGender());
    }

    useEffect(() => {
        loadData();
        console.log("jk",jk);
        jk.map((j, index) => {
            if(index === 0){
                setGender(j.name);
                setFieldValue('id_gender', j.id);
            }
        })
    }, []);

    const openGallery = async () => {
        const images = await launchImageLibrary(options);
        setFoto(images);
    }


    return (
        <View style={tw`bg-white h-full`}>
            <ScrollView>
                <View style={tw`p-4`}>
                    <View style={tw`flex flex-row justify-center mt-8 w-1/2 mx-auto`}>
                        <Image
                            style={[tw``, customStyle.aspectSquare]}
                            source={require('../assets/images/second-logo.jpg')}
                        />
                    </View>

                    <View style={tw`my-15`}>
                        <Text style={tw`text-black mt-4`}>Nama Lengkap</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded bg-gray-200`}
                            onChangeText={(nama) => setFieldValue('nama', nama)}
                            value={values.nama}
                            placeholder="nama"
                        />
                        {errors.nama && touched.nama ? (
                            <Text style={tw`text-red-500`}>{errors.nama}</Text>
                        ) : null}

                        <Text style={tw`text-black mt-4`}>Email</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded bg-gray-200`}
                            onChangeText={(email) => setFieldValue('email', email)}
                            value={values.email}
                            placeholder="example@gmail.com"
                        />
                        {errors.email && touched.email ? (
                            <Text style={tw`text-red-500`}>{errors.email}</Text>
                        ) : null}

                        <Text style={tw`text-black mt-4`}>Password</Text>
                        <View style={tw`flex flex-row border border-gray-300 rounded bg-gray-200`}>
                            <TextInput
                                style={tw`w-11/12 h-12 px-4`}
                                onChangeText={(password) => setFieldValue('password', password)}
                                value={values.password}
                                placeholder="******"
                                secureTextEntry={showPassword}
                            />
                            <Icon style={tw`w-1/12 self-center`} name={showPassword ? "eye-slash" : "eye"} size={20} color="#9e9e9e" onPress={changeIconPassword} />
                        </View>
                        {errors.password && touched.password ? (
                            <Text style={tw`text-red-500`}>{errors.password}</Text>
                        ) : null}

                        <Text style={tw`text-black mt-4`}>Tanggal Lahir</Text>
                        <Pressable onPress={showDatepicker} style={tw`border border-gray-300 rounded bg-gray-200`}>
                            <Text style={tw`p-4`}>{values.tanggal_lahir ? format(new Date(date), 'dd/MM/yyyy') : ""}</Text>
                        </Pressable>
                        {errors.tanggal_lahir && touched.tanggal_lahir ? (
                            <Text style={tw`text-red-500`}>{errors.tanggal_lahir}</Text>
                        ) : null}

                        <View style={tw`flex flex-row justify-between mt-8`}>
                            {jk.map((jkUser, index) => {
                                return (
                                    <View style={tw`flex flex-row justify-center w-1/2`} key={index}>
                                        {gender === jkUser.name ? 
                                            <Icon style={tw`self-center mr-2`} name="dot-circle" size={30} color="#e91e63" /> :
                                            <Icon style={tw`self-center mr-2`} name="circle" size={30} color="#9e9e9e" onPress={() => {
                                                setGender(jkUser.name);
                                                setFieldValue('id_gender', jkUser.id);
                                            }} />
                                        }
                                        <Text style={tw`text-lg font-semibold`}>{jkUser.name}</Text>
                                    </View>
                                )
                            })}
                        </View>

                        <Text style={tw`text-black mt-8`}>Nomor Handphone</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded bg-gray-200`}
                            onChangeText={(phone) => setFieldValue('no_hp', phone)}
                            value={values.no_hp}
                            placeholder="08*****"
                            keyboardAppearance="number-pad"
                        />
                        {errors.no_hp && touched.no_hp ? (
                            <Text style={tw`text-red-500`}>{errors.no_hp}</Text>
                        ) : null}

                        <Text style={tw`text-black mt-4`}>Berat Badan</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded bg-gray-200`}
                            onChangeText={(event) => setFieldValue('berat_badan', event)}
                            value={values.berat_badan}
                            placeholder="0"
                            keyboardAppearance="number-pad"
                        />
                        {errors.berat_badan && touched.berat_badan ? (
                            <Text style={tw`text-red-500`}>{errors.berat_badan}</Text>
                        ) : null}

                        <Text style={tw`text-black mt-4`}>Tinggi Badan</Text>
                        <TextInput
                            style={tw`w-full h-12 px-4 border border-gray-300 rounded bg-gray-200`}
                            onChangeText={(event) => setFieldValue('tinggi_badan', event)}
                            value={values.tinggi_badan}
                            placeholder="0"
                            keyboardAppearance="number-pad"
                        />
                        {errors.tinggi_badan && touched.tinggi_badan ? (
                            <Text style={tw`text-red-500`}>{errors.tinggi_badan}</Text>
                        ) : null}

                        <TouchableOpacity style={tw`mt-12`} onPress={openGallery}>
                            <View style={tw`w-full flex flex-row justify-center`}>
                                <Image
                                    style={tw`w-1/3 h-24`}
                                    source={require('../assets/images/upload-image.jpg')}
                                />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={handleSubmit}
                            style={tw`bg-red-600 p-2 rounded-full mt-12`}
                        >
                            <Text style={tw`text-white text-lg text-center`}>Daftar</Text>
                        </TouchableOpacity>

                        <View style={tw`flex flex-row justify-center mt-12`}>
                            <Text style={tw`text-lg font-bold`}>Sudah punya akun? </Text>
                            <Text onPress={() => navigation.navigate('Login')} style={tw`text-lg font-bold text-red-500`}>Masuk</Text>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Register;