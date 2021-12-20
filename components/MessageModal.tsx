import React, { useState } from 'react'
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native'
import colors from './Colors';

const MessageModal = (props: any) => {
    return (
        <Modal
        animationType='fade'
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          props.setModalVisible(!props.modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.message}>{props.message}</Text>
            <Pressable
              style={styles.button}
              onPress={() => props.setModalVisible(!props.modalVisible)}
            >
              <Text style={styles.text}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    },
    modalView: {
        width: '70%',
        height: '30%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        justifyContent: 'space-around',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
    },
    button: {backgroundColor: colors.main, padding: 15, borderRadius: 10, 
        width: 100, alignItems: 'center'},
    message: {fontFamily: 'youtube_font', color: colors.bg, fontSize: 20},
    text: {fontFamily: 'youtube_font', color: 'white'},
});



export default MessageModal