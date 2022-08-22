import React, { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, View, Modal, StyleSheet, TextInput } from 'react-native'
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from "react-redux";
import { addSpecialist, deleteSpesialist, editSpecialist, getSpecialist } from '../redux/actions/specialist-actions';

const Specialist = ({navigation}) => {

    const dispatch = useDispatch();
    const [modalAddSpecialist, setModalAddSpecialist] = useState(false);
    const [addName, setAddName] = useState("");
    const [modalEditSpecialist, setModalEditSpecialist] = useState(false);
    const [editName, setEditName] = useState("");
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
            name: addName
        }
        await dispatch(addSpecialist(data))
        .then(response => {
            console.log("res : ", response);
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
            name: editName
        }
        await dispatch(editSpecialist(data, editId))
        .then(response => {
            console.log("res : ", response);
            if(response.status === "success"){
                setModalEditSpecialist(false);
                setEditName("");
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
                <Text style={tw`text-lg`}>Spesialis</Text>
                <Text></Text>
            </View>

            <View style={tw`px-4 mt-8`}>
                <View>
                    <Text style={tw`text-lg text-black`}>Spesialisasi medis</Text>
                    <Text>Berbagai pilihan spesialisasi dokter</Text>
                </View>
                <View style={tw`flex flex-row justify-end`}>
                    <Pressable 
                        onPress={() => setModalAddSpecialist(true)}
                        style={tw`bg-blue-500 p-2 rounded`}
                    >
                        <Text style={tw`text-white text-sm`}>Tambah Spesialis</Text>
                    </Pressable>
                </View>

                <ScrollView style={tw`mt-4`}>
                    {specialist.map((spesialis, index) => {
                        return (
                            <View
                                style={tw`flex flex-row justify-between items-center border border-gray-200 p-2 rounded`} key={index}
                             >
                                <Text>{spesialis.name}</Text>
                                <View style={tw`flex flex-row items-center`}>
                                    <Pressable 
                                        onPress={() => {
                                            setEditId(spesialis.id);
                                            setEditName(spesialis.name);
                                            setModalEditSpecialist(true);
                                        }}
                                        style={tw`ml-2 bg-green-500 py-2 px-3 rounded-lg`}
                                    >
                                        <Icon name="edit" size={15} color="#ffffff" solid />
                                    </Pressable>
                                    <Pressable 
                                        onPress={() => {
                                            Alert.alert(
                                                "Hapus Spesialis",
                                                "Apakah anda yakin ?",
                                                [
                                                    { text: "Tidak" },
                                                    { text: "Ya", onPress: () => {
                                                        triggerDeleteUser(spesialis.id)
                                                    }}
                                                ]
                                            );
                                        }}
                                        style={tw`ml-2 bg-red-500 py-2 px-3 rounded-lg`}
                                    >
                                        <Icon name="trash-alt" size={15} color="#ffffff" solid />
                                    </Pressable>
                                </View>
                            </View>
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={tw`text-xl font-bold mb-4`}>Tambah Spesialis Baru</Text>
                        <View style={tw`w-full mb-4`}>
                        <TextInput
                            onChangeText={(event => setAddName(event))}
                            value={addName}
                            style={tw`w-full border border-gray-400 rounded-lg px-4`}
                        />
                        {addName === "" ? (
                            <Text style={tw`text-red-500`}>Tidak boleh kosong</Text>
                        ) : null}
                        </View>

                        <View style={tw`flex flex-row`}>
                            <Pressable 
                                onPress={hideModalAddSpecialist}
                                style={tw`bg-gray-500 p-2 w-2/5 rounded-lg mr-1`}
                            >
                                <Text style={tw`text-white text-center text-lg`}>Batal</Text>
                            </Pressable>
                            <Pressable
                                disabled={addName != "" ? false : true}
                                onPress={triggerAddSpecialist}
                                style={tw`${addName != "" ? "bg-blue-500" : "bg-gray-500"} p-2 w-2/5 rounded-lg ml-1`}
                            >
                                <Text style={tw`text-white text-center text-lg`}>Tambah</Text>
                            </Pressable>
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={tw`text-xl font-bold mb-4`}>Ubah Spesialis</Text>
                        <View style={tw`w-full mb-4`}>
                        <TextInput
                            onChangeText={(event => setEditName(event))}
                            value={editName}
                            style={tw`w-full border border-gray-400 rounded-lg px-4`}
                        />
                        {editName === "" ? (
                            <Text style={tw`text-red-500`}>Tidak boleh kosong</Text>
                        ) : null}
                        </View>

                        <View style={tw`flex flex-row`}>
                            <Pressable 
                                onPress={hideModalEditSpecialist}
                                style={tw`bg-gray-500 p-2 w-2/5 rounded-lg mr-1`}
                            >
                                <Text style={tw`text-white text-center text-lg`}>Batal</Text>
                            </Pressable>
                            <Pressable
                                disabled={editName != "" ? false : true}
                                onPress={triggerEditSpecialist}
                                style={tw`${editName != "" ? "bg-blue-500" : "bg-gray-500"} p-2 w-2/5 rounded-lg ml-1`}
                            >
                                <Text style={tw`text-white text-center text-lg`}>Simpan</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      padding: 30
    },
    modalView: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
            width: 0,
            height: 2
        },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '100%'
    }
  });

export default Specialist;