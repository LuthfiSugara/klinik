import React, { useEffect, useState, useRef } from 'react'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from "yup";
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from "react-redux";
import { getSpecialist } from '../redux/actions/specialist-actions';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from 'date-fns';
import {
    actions,
    defaultActions,
    RichEditor,
    RichToolbar,
} from "react-native-pell-rich-editor";
import { detailDokter, editDokter } from '../redux/actions/dokter-actions';
import {launchImageLibrary} from 'react-native-image-picker';
import { baseUrl } from '../utils/global';
import { getGender } from '../redux/actions/setting-actions';
import { customStyle } from '../utils/global-style';
import { formatRupiah } from '../utils/function';

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

const EditDokter = ({navigation, route}) => {
    const { idDokter } = route.params;
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(true);
    const [loadPage, setLoadPage] = useState(false);
    
    const RichText = useRef();
    const [foto, setFoto] = useState();
    

    const {specialist} = useSelector((state) => state.specialistReducers);
    const {loading, detail_dokter} = useSelector((state) => state.dokterReducers);
    const {gender} = useSelector((state) => state.authReducers);

    const loadData = async() => {
        await dispatch(detailDokter(idDokter));
        await dispatch(getSpecialist());
        await dispatch(getGender());
    }

    useEffect(() => {
        loadData();
    }, []);

    const [date, setDate] = useState(new Date(format(new Date(detail_dokter.tanggal_lahir), 'yyyy'), format(new Date(detail_dokter.tanggal_lahir), 'M') - 1, format(new Date(detail_dokter.tanggal_lahir), 'd')));
    const [startWork, setStartWork] = useState(
        detail_dokter?.detail ? 
            new Date(
                format(new Date(detail_dokter?.detail?.mulai_praktek), 'yyyy'), 
                format(new Date(detail_dokter?.detail?.mulai_praktek), 'M') - 1, 
                format(new Date(detail_dokter?.detail?.mulai_praktek), 'd')
            )
            : new Date(
                format(new Date(), 'yyyy'), 
                format(new Date(), 'M') - 1, 
                format(new Date(), 'd')
            )
    );
    const [previewImage, setPreviewImage] = useState(baseUrl + detail_dokter.foto);

    const {values, setFieldValue, handleSubmit, handleReset, errors, touched} = useFormik({
        initialValues: {
            nama: detail_dokter.nama,
            password: '',
            id_specialist: detail_dokter?.detail?.id_specialist,
            id_gender: detail_dokter.id_gender,
            tanggal_lahir: detail_dokter.tanggal_lahir,
            mulai_praktek: detail_dokter?.detail ? detail_dokter?.detail?.mulai_praktek : new Date(),
            keterangan: detail_dokter?.detail ? detail_dokter?.detail?.keterangan : "",
            biaya: formatRupiah(detail_dokter?.detail ? detail_dokter?.detail?.biaya : 0),
        },
        onSubmit: values => {
            let splitBiaya = values.biaya.split(".");
            
            const formData = new FormData();
            formData.append('nama', values.nama);
            if(values.password != ''){
                formData.append('password', values.password);
            }
            formData.append('id_specialist', values.id_specialist);
            formData.append('id_gender', values.id_gender);
            formData.append('tanggal_lahir', values.tanggal_lahir);
            formData.append('mulai_praktek', values.mulai_praktek);
            formData.append('keterangan', values.keterangan);
            formData.append('biaya', splitBiaya.join(''));
            if(foto){
                formData.append('foto', {
                    uri: foto.assets[0].uri,
                    type: foto.assets[0].type,
                    name: foto.assets[0].fileName,
                });
            }
            setLoadPage(true);
            dispatch(editDokter(formData, idDokter))
            .then(response => {
                if(response.status === "success"){
                    setLoadPage(false);
                    navigation.goBack();
                }
            })
            .catch(err => console.log(err));
        },
        validationSchema: Yup.object().shape({
            nama: Yup
                .string()
                .required("Tidak boleh kosong!"),
            password: Yup
                .string()
                .min(6, "Minimal 6 karakter"),
            id_specialist: Yup
                .string()
                .required("Tidak boleh kosong!"),
            id_gender: Yup
                .number()
                .integer()
                .required("Tidak boleh kosong!"),
            tanggal_lahir: Yup
                .string()
                .required("Tidak boleh kosong!"),
            mulai_praktek: Yup
                .string()
                .required("Tidak boleh kosong!"),
            keterangan: Yup
                .string()
                .required("Tidak boleh kosong!"),
            biaya: Yup
                .string()
                .required("Tidak boleh kosong!"),
        }),
    });

    const changeIconPassword = () => {
        showPassword === false ? setShowPassword(true) : setShowPassword(false);
    }

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

    const onChangeStartWork = (event, selectedDate) => {
        setStartWork(selectedDate);
        setFieldValue('mulai_praktek', format(new Date(selectedDate), 'yyyy/MM/dd'));
    };

    const showModeStartWork = (currentMode) => {
        DateTimePickerAndroid.open({
            value: startWork,
            onChange: onChangeStartWork,
            mode: currentMode,
            is24Hour: true,
            maximumDate: new Date(format(new Date(), 'yyyy'), format(new Date(), 'M') - 1, format(new Date(), 'd'))
        });
    };

    const showStartWorkpicker = () => {
        showModeStartWork('date');
    };

    const openGallery = async () => {
        const images = await launchImageLibrary(options);
        if(!images.didCancel){
            setFoto(images);
            setPreviewImage(images.assets[0].uri);
        }
    }

    return loadPage ? (
        <View style={tw`flex flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#ff1402" />
            <Text style='text-center'>Loading....</Text>
        </View>
    ) : (
        <View style={tw`h-full bg-white`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-lg`}>Edit Dokter</Text>
                <View></View>
            </View>

            <ScrollView style={tw`px-4 bg-white`}>
                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Nama Lengkap</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded px-4`}
                        onChangeText={(e) => setFieldValue('nama', e)}
                        value={values.nama}
                    />
                    {errors.nama && touched.nama ? (
                        <Text style={tw`text-red-500`}>{errors.nama}</Text>
                    ) : null}
                </View>
                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Password</Text>
                    <View style={tw`flex flex-row border border-gray-300 rounded`}>
                        <TextInput
                            style={tw`w-11/12 h-12 px-4`}
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

                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Spesialis</Text>
                    <View style={tw`border border-gray-300 rounded`}>
                        <Picker
                            selectedValue={values.id_specialist}
                            onValueChange={(itemValue, itemIndex) =>
                                setFieldValue('id_specialist', itemValue)
                            }>
                                {specialist.map((spesialis, index) => {
                                    return (
                                        <Picker.Item label={spesialis.name} value={spesialis.id} key={index} />
                                    )
                                })}
                        </Picker> 
                    </View>
                    {errors.id_specialist && touched.id_specialist ? (
                        <Text style={tw`text-red-500`}>{errors.id_specialist}</Text>
                    ) : null}
                </View>

                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Biaya</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded px-4`}
                        onChangeText={(e) => setFieldValue('biaya', formatRupiah(e))}
                        value={values.biaya.toString()}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                    {errors.biaya && touched.biaya ? (
                        <Text style={tw`text-red-500`}>{errors.biaya}</Text>
                    ) : null}
                </View>

                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Jenis Kelamin</Text>
                    <View style={tw`border border-gray-300 rounded`}>
                        <Picker
                            selectedValue={values.id_gender}
                            onValueChange={(itemValue, itemIndex) =>
                                setFieldValue('id_gender', itemValue)
                            }>
                                {gender.map((g, index) => {
                                    return (
                                        <Picker.Item label={g.name} value={g.id} key={index} />
                                    )
                                })}
                        </Picker>
                    </View>
                    {errors.id_gender && touched.id_gender ? (
                        <Text style={tw`text-red-500`}>{errors.id_gender}</Text>
                    ) : null}
                </View>

                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Tanggal Lahir</Text>
                    <Pressable onPress={showDatepicker} style={tw`border border-gray-300 rounded`}>
                        <Text style={tw`p-4`}>{values.tanggal_lahir ? format(new Date(date), 'dd/MM/yyyy') : ""}</Text>
                    </Pressable>
                    {errors.tanggal_lahir && touched.tanggal_lahir ? (
                        <Text style={tw`text-red-500`}>{errors.tanggal_lahir}</Text>
                    ) : null}
                </View>

                <View style={tw`mt-4`}>
                    <Text style={tw`text-gray-500 mb-1`}>Mulai Praktek</Text>
                    <Pressable onPress={showStartWorkpicker} style={tw`border border-gray-300 rounded`}>
                        <Text style={tw`p-4`}>{values.mulai_praktek ? format(new Date(startWork), 'dd/MM/yyyy') : ""}</Text>
                    </Pressable>
                    {errors.mulai_praktek && touched.mulai_praktek ? (
                        <Text style={tw`text-red-500`}>{errors.mulai_praktek}</Text>
                    ) : null}
                </View>

                <TouchableOpacity style={tw`mt-6 pb-4`} onPress={openGallery}>
                    <View style={tw`w-1/2 mx-auto flex flex-row justify-center`}>
                        <Image
                            style={[tw`w-1/2 h-42 rounded`, customStyle.aspectSquare]}
                            source={{
                                uri: previewImage,
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <ScrollView style={styles.container}>
                    <Text style={tw`text-gray-500 mb-1`}>Keterangan</Text>
                    {errors.keterangan && touched.keterangan ? (
                        <Text style={tw`text-red-500`}>{errors.keterangan}</Text>
                    ) : null}
                    
                        {!loadPage ? ( 
                            <View>
                                <RichToolbar
                                    style={[styles.richBar]}
                                    editor={RichText}
                                    disabled={false}
                                    iconSize={25}
                                    selectedIconTint={"blue"}
                                    actions={[
                                        ...defaultActions,
                                        actions.heading1,
                                    ]}
                                    iconMap={{
                                        [actions.heading1]: ({ tintColor }) => (
                                            <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
                                        ),
                                    }}
                                />
                                <RichEditor
                                    disabled={false}
                                    containerStyle={styles.editor}
                                    initialContentHTML={values.keterangan}
                                    ref={RichText}
                                    style={styles.rich}
                                    placeholder={"Keterangan Dokter"}
                                    onChange={(text) => setFieldValue('keterangan', text)}
                                />
                                <Text></Text>
                            </View>
                        ) : (
                            ""
                        )}
                </ScrollView>
            </ScrollView>
            <TouchableOpacity 
                style={tw`bg-red-500 p-2 mx-4 my-4 rounded-lg`}
                onPress={() => {
                    handleSubmit();
                }}
            >
                <Text style={tw`text-white text-center text-lg`}>Simpan</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    a: {
      fontWeight: "bold",
    },
    div: {
      fontFamily: "monospace",
    },
    p: {
      fontSize: 30,
    },
    /*******************************/
    container: {
      flex: 1,
      marginTop: 20,
    //   backgroundColor: "#F5FCFF",
    },
    editor: {
      borderColor: "#c9c6c6",
      borderWidth: 1,
      marginTop: 5,
      borderRadius: 8,
      minHeight: 50,
    },
    rich: {
      minHeight:40,
      height: 40,
      flex: 1,

    },
    richBar: {
      height: 50,
    },
    text: {
      fontWeight: "bold",
      fontSize: 20,
    },
    tib: {
      textAlign: "center",
    },
});

export default EditDokter