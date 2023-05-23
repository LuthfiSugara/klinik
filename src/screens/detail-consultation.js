import React, { useEffect } from 'react'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createDetailConsultation, getDetailConsultation } from '../redux/actions/consultation-actions';
import { customStyle } from '../utils/global-style';
import { baseUrl } from '../utils/global';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useIsFocused } from "@react-navigation/native";
import { getProfile } from '../redux/actions/auth-actions';

const DetailConsultation = ({navigation, route}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const {id} = route.params;

    const {detail_consultation} = useSelector((state) => state.consultationReducers);
    const {profile} = useSelector((state) => state.authReducers);

    const loadData = async() => {
        await dispatch(getDetailConsultation(id));
        await dispatch(getProfile());
    }

    useEffect(() => {
        loadData();
    }, [isFocused]);

    console.log("id : ", id);
    console.log("detail : ", detail_consultation);

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            detail: '',
            id_user: profile.id,
            id_consultation: id,
        },
        onSubmit: values => {
            
            console.log("values : ", values);
            dispatch(createDetailConsultation(values))
            .then(response => {
                if(response.status === "success"){
                    loadData();
                    handleReset();
                }
            })
            .catch(err => console.log(err));
        },
        validationSchema: Yup.object().shape({
            detail: Yup
                .string()
                .required("Tidak boleh kosong!")
        }),
    });

    return (
        <View style={tw`bg-white h-full`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>Detail Konsultasi</Text>
                <View></View>
            </View>

            <ScrollView>
                <View style={tw`mx-2`}>
                    <View style={tw`flex flex-row items-center mt-4 mb-8`}>
                        <View style={[tw`rounded`, customStyle.w25]}>
                            <Image
                                style={[tw`rounded`, customStyle.aspectSquare]}
                                source={{
                                    uri: baseUrl + detail_consultation?.pasien?.foto,
                                }}
                            />
                        </View>
                        <View style={[tw`pl-4`, customStyle.w75]}>
                            <Text style={tw`text-lg`}>{detail_consultation.consultation}</Text>
                            <Text style={tw`text-xs`}>{detail_consultation.posting_time}</Text>
                        </View>
                    </View>
                    
                    {detail_consultation && detail_consultation.detail ? (
                        detail_consultation.detail.length > 0 && detail_consultation.detail.map((detail, index) => {
                            return (
                                <View style={tw`flex flex-row items-center mt-4`} key={index}>
                                    <View style={[tw`rounded`, customStyle.w10]}>
                                        <Image
                                            style={[tw`rounded-full`, customStyle.aspectSquare]}
                                            source={{
                                                uri: baseUrl + detail?.user?.foto,
                                            }}
                                        />
                                    </View>
                                    <View style={[tw`pl-4`, customStyle.w90]}>
                                        <Text style={tw`text-black font-bold`}>{detail?.user?.nama}</Text>
                                        <Text style={tw`text-xs`}>{detail.posting_time}</Text>
                                        <Text style={tw`text-xs`}>{detail.detail}</Text>
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
                             <Text style={tw`text-black text-center text-lg`}>Belum ada Jawaban</Text>
                         </View>
                    )}
                </View>
            </ScrollView>
            {errors.detail && touched.detail ? (
                <Text style={tw`text-xs text-red-500 px-4 mt-4 mb-1`}>{errors.detail}</Text>
            ) : null}
            <View style={tw`flex flex-row items-center mx-4 mb-4`}>
                <TextInput
                    style={[tw`border border-gray-300 rounded text-black px-4 mr-2`, customStyle.w75]}
                    onChangeText={(e) => setFieldValue('detail', e)}
                    value={values.detail}
                />
                
                <TouchableOpacity onPress={handleSubmit} style={[tw`bg-red-500 p-3 rounded`, customStyle.w25]}>
                    <Text style={tw`text-white text-center`}>Kirim</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DetailConsultation