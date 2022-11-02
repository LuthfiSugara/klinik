import React from 'react';
import { StyleSheet } from 'react-native';

export const customStyle = StyleSheet.create({
    aspectSquare: {
        resizeMode: 'contain',
        flex: 1,
        aspectRatio: 1/1,
    },
    shadow: {  
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 10, height: 0},
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: 'white'
    },
    w5: {
        width: '5%'
    },
    w10: {
        width: '10%'
    },
    w15: {
        width: '15%'
    },
    w20: {
        width: '20%'
    },
    w25: {
        width: '25%'
    },
    w30: {
        width: '30%'
    },
    w70: {
        width: '70%'
    },
    w75: {
        width: '75%'
    },
    w80: {
        width: '80%'
    },
    w85: {
        width: '85%'
    },
    w90: {
        width: '90%'
    },
    w95: {
        width: '95%'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        paddingVertical: 10,
        width: '100%'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        // alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
                width: 0,
                height: 2
            },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
    }
});