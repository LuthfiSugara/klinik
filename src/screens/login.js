import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, Button } from "react-native";
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/actions/auth-actions";
import DeviceInfo from 'react-native-device-info';
import { customStyle } from "../utils/global-style";

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
            dispatch(signIn(values))
            .then(response => {
                console.log('values : ', values);
                console.log('response : ', response);
            })
            .catch(err => console.log('err : ', err));
            
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
                    <View style={tw`flex flex-row justify-center mt-15 w-1/2 mx-auto`}>
                        <Image
                            style={[tw``, customStyle.aspectSquare]}
                            source={require('../assets/images/logo.png')}
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
                                style={[tw`h-12 px-4`, customStyle.w90]}
                                onChangeText={(password) => setFieldValue('password', password)}
                                value={values.password}
                                placeholder="******"
                                secureTextEntry={showPassword}
                            />
                            <Icon style={[tw`self-center text-center pr-2`, customStyle.w10]} name={showPassword ? "eye-slash" : "eye"} size={20} color="#9e9e9e" onPress={changeIconPassword} />
                        </View>
                        {errors.password && touched.password ? (
                            <Text style={tw`text-red-500`}>{errors.password}</Text>
                        ) : null}

                        <TouchableOpacity 
                            onPress={handleSubmit}
                            style={tw`bg-red-600 py-3 rounded-full mt-12`}
                        >
                            <Text style={tw`text-white text-center`}>Masuk</Text>
                        </TouchableOpacity>

                        <View style={tw`flex flex-row justify-center mt-12`}>
                            <Text style={tw`font-bold`}>Belum punya akun? </Text>
                            <Text onPress={() => navigation.navigate('Register')} style={tw`font-bold text-red-500`}>Daftar</Text>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Login;