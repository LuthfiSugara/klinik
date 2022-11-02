import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from "react-redux";
import { addSpecialist, deleteSpesialist, editSpecialist, getSpecialist } from '../redux/actions/specialist-actions';
import { customStyle } from '../utils/global-style';
import { limitSentence } from '../utils/function';

const Specialist = ({navigation}) => {

    const dispatch = useDispatch();
    const [modalAddSpecialist, setModalAddSpecialist] = useState(false);
    const [addName, setAddName] = useState("");
    const [addDescription, setAddDescription] = useState("");
    const [modalEditSpecialist, setModalEditSpecialist] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editId, setEditId] = useState("");

    const {loading, specialist} = useSelector((state) => state.specialistReducers);

    const loadData = async() => {
       await dispatch(getSpecialist());
    }

    useEffect(() => {
        loadData();
    }, []);

    const triggerDeleteUser = async(id) => {
        await dispatch(deleteSpesialist(id))
        .then(response => {
            if(response.status === "success"){
                loadData();
            }
        })
        .catch(err => console.log(err));
    }

    const hideModalAddSpecialist = () => {
        setModalAddSpecialist(false);
    }

    const triggerAddSpecialist = async() => {
        let data = {
            name: addName,
            description: addDescription,
        }
        await dispatch(addSpecialist(data))
        .then(response => {
            if(response.status === "success"){
                setModalAddSpecialist(false);
                setAddName("");
                loadData();
            }
        })
        .catch(err => console.log(err));
    }

    const hideModalEditSpecialist = () => {
        setModalEditSpecialist(false);
    }

    const triggerEditSpecialist = async() => {
        let data = {
            name: editName,
            description: editDescription,
        }
        await dispatch(editSpecialist(data, editId))
        .then(response => {
            if(response.status === "success"){
                setModalEditSpecialist(false);
                setEditName("");
                setEditDescription("");
                loadData();
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <View style={tw`h-full bg-white`}>
            <View style={tw`flex flex-row justify-between p-4 items-center bg-white`}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000000" style={tw`mr-1`} solid />
                </Pressable>
                <Text style={tw`text-black`}>Spesialis</Text>
                <Text></Text>
            </View>

            <View style={tw`px-4 mt-4`}>
                <View>
                    <Text style={tw`text-lg text-black`}>Spesialisasi Medis</Text>
                    <Text style={tw`text-black`}>Berbagai pilihan spesialisasi dokter</Text>
                </View>
                <View style={tw`flex flex-row justify-end mt-4`}>
                    <TouchableOpacity 
                        onPress={() => setModalAddSpecialist(true)}
                        style={tw`bg-blue-500 p-2 rounded`}
                    >
                        <Text style={tw`text-white text-sm`}>Tambah Spesialis</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={tw`mt-4`}>
                    {specialist.map((spesialis, index) => {
                        return (
                            <TouchableOpacity
                                style={tw`flex flex-row justify-between items-center border border-gray-200 p-2 mb-2 rounded`} 
                                key={index}
                                delayLongPress={500}
                                onLongPress={() => Alert.alert(
                                    "Hapus Spesialis",
                                    "Apakah anda yakin ?",
                                    [
                                        { text: "Tidak" },
                                        { text: "Ya", onPress: () => {
                                            triggerDeleteUser(spesialis.id)
                                        }}
                                    ]
                                )}
                            >
                                <View style={customStyle.w80}>
                                    <Text style={tw`text-black`}>{spesialis.name}</Text>
                                    <Text style={tw`text-xs text-gray-500`}>{limitSentence(spesialis.description)}</Text>
                                </View>
                                <View style={[tw`flex flex-row items-center text-black`, customStyle.w20]}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setEditId(spesialis.id);
                                            setEditName(spesialis.name);
                                            setEditDescription(spesialis.description);
                                            setModalEditSpecialist(true);
                                        }}
                                        style={tw`ml-2 py-1 px-1 rounded-lg`}
                                    >
                                        <Text style={tw`bg-green-500 text-white py-1 px-2 rounded`}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalAddSpecialist}
                onRequestClose={() => {
                    setModalAddSpecialist(false);
                }}
            >
                <View style={customStyle.centeredView}>
                    <TouchableOpacity onPress={hideModalAddSpecialist} style={tw`flex flex-row justify-end w-full`}>
                        <Text style={[tw`text-right rounded-full py-3 px-4 mr-4 mb-2 text-black font-bold`, customStyle.shadow]}>X</Text>
                    </TouchableOpacity>
                    <View style={customStyle.modalView}>
                        <ScrollView style={tw`w-full bg-white`}>
                            <Text style={tw`text-xl text-black font-bold mb-4`}>Tambah Spesialis Baru</Text>
                            <View style={tw`w-full mb-4`}>
                                <TextInput
                                    onChangeText={(event => setAddName(event))}
                                    value={addName}
                                    style={tw`w-full text-black border border-gray-400 rounded-lg px-4`}
                                />
                                {addName === "" ? (
                                    <Text style={tw`text-red-500 text-xs`}>Tidak boleh kosong</Text>
                                ) : null}

                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(event => setAddDescription(event))}
                                    value={addDescription}
                                    style={tw`w-full text-black border border-gray-400 rounded-lg px-4 mt-4`}
                                />
                                {addDescription === "" ? (
                                    <Text style={tw`text-red-500 text-xs`}>Tidak boleh kosong</Text>
                                ) : null}
                            </View>
                        </ScrollView>
                        <View style={tw`flex flex-row justify-center mt-4`}>
                            <TouchableOpacity
                                disabled={addName != "" ? false : true}
                                onPress={triggerAddSpecialist}
                                style={tw`${addName != "" ? "bg-blue-500" : "bg-gray-500"} p-2 w-full rounded-lg ml-1`}
                            >
                                <Text style={tw`text-white text-center text-lg`}>Tambah</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditSpecialist}
                onRequestClose={() => {
                    setModalEditSpecialist(false);
                }}
            >
                <View style={customStyle.centeredView}>
                    <TouchableOpacity onPress={hideModalEditSpecialist} style={tw`flex flex-row justify-end w-full`}>
                        <Text style={[tw`text-right rounded-full py-3 px-4 mr-4 mb-2 text-black font-bold`, customStyle.shadow]}>X</Text>
                    </TouchableOpacity>
                    <View style={customStyle.modalView}>
                        <ScrollView style={tw`w-full`}>
                            <Text style={tw`text-xl text-black font-bold mb-4`}>Ubah Spesialis</Text>
                            <View style={tw`w-full mb-4`}>
                                <TextInput
                                    onChangeText={(event => setEditName(event))}
                                    value={editName}
                                    style={tw`w-full border border-gray-400 rounded-lg px-4 text-black`}
                                />
                                {editName === "" ? (
                                    <Text style={tw`text-red-500 text-xs`}>Tidak boleh kosong</Text>
                                ) : null}

                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(event => setEditDescription(event))}
                                    value={editDescription}
                                    style={tw`w-full text-black border border-gray-400 rounded-lg px-4 mt-4`}
                                />
                                {editDescription === "" ? (
                                    <Text style={tw`text-red-500 text-xs`}>Tidak boleh kosong</Text>
                                ) : null}
                            </View>
                            
                        </ScrollView>
                        <View style={tw`flex flex-row justify-center mt-4`}>
                            <TouchableOpacity
                                disabled={editName != "" ? false : true}
                                onPress={triggerEditSpecialist}
                                style={tw`${editName != "" ? "bg-blue-500" : "bg-gray-500"} p-2 w-full rounded-lg ml-1`}
                            >
                                <Text style={tw`text-white text-center text-lg`}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Specialist;