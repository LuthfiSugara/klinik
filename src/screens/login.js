import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, Button } from "react-native";
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/actions/auth-actions";
import DeviceInfo from 'react-native-device-info';

const Login = ({navigation}) => {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(true);

    const changeIconPassword = () => {
        showPassword === false ? setShowPassword(true) : setShowPassword(false);
    }

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            email: '',
            password: '',
            device_name: DeviceInfo.getBrand()
        },
        onSubmit: values => {
            return dispatch(signIn(values));
            // handleReset();
        },
        validationSchema: Yup.object().shape({
            email: Yup
                .string()
                .required("Tidak boleh kosong!")
                .email('format email salah'),
            password: Yup
                .string()
                .min(6, "Minimal 6 karakter")
                .required("Tidak boleh kosong"),
        }),
    });

    return (
        <View style={tw`bg-white h-full`}>
            <ScrollView>
                <View style={tw`p-4`}>
                    <View style={tw`flex flex-row justify-center mt-8`}>
                        <Image
                            style={tw`w-72 h-72`}
                            source={require('../assets/images/second-logo.jpg')}
                        />
                    </View>

                    <View style={tw`mt-20`}>
                        <Text style={tw`text-black`}>Email</Text>
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
                            <Icon style={tw`w-1/12 self-center`} name={showPassword ? "eye-slash" : "eye"} size={30} color="#9e9e9e" onPress={changeIconPassword} />
                        </View>
                        {errors.password && touched.password ? (
                            <Text style={tw`text-red-500`}>{errors.password}</Text>
                        ) : null}

                        <TouchableOpacity 
                            onPress={handleSubmit}
                            style={tw`bg-red-600 p-2 rounded-full mt-12`}
                        >
                            <Text style={tw`text-white text-lg text-center`}>Masuk</Text>
                        </TouchableOpacity>

                        <View style={tw`flex flex-row justify-center mt-12`}>
                            <Text style={tw`text-lg font-bold`}>Belum punya akun? </Text>
                            <Text onPress={() => navigation.navigate('Register')} style={tw`text-lg font-bold text-red-500`}>Daftar</Text>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Login;