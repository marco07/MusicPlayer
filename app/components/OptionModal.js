//import liraries

import React  from 'react';
import { View, Text, StyleSheet, Modal, StatusBar, TouchableWithoutFeedback } from 'react-native';
import color from '../misc/color'
// create a component
const OptionModal = ({visible, currentItem,onClose, onPlayPress, onPlayListPress}) => {
    const {filename} = currentItem
    return <>
    <StatusBar hidden />
    <Modal animationType='fade' transparent visible={visible}>
        <View style={styles.modal}>
        <Text style={styles.title} numberOfLines={2}>
            {filename}
        </Text>
        <View style={styles.optionContainer}>
        <TouchableWithoutFeedback onPress={onPlayPress}>
            <Text style={styles.option}>Play</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onPlayListPress}>
            <Text style={styles.option}>Add to PlayList</Text>
        </TouchableWithoutFeedback>
        </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
             <View style={styles.modalBg} />
        </TouchableWithoutFeedback>
        
    </Modal>
    </>
};

// define your styles
const styles = StyleSheet.create({
    modal: {
        position:'absolute',
        bottom:0,
        right:0,
        left:0,
        backgroundColor: color.APP_BG,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        zIndex:1000,

     },
     optionContainer:{
        padding:20,
     },
     title:{
        fontSize:18,
        padding:20,
        paddingBottom:0,
        color: color.FONT_MEDIUM,
   
     },
     option:{
        fontSize:16,
        fontWeight:'bold',
        color: color.FONT,
        paddingVertical:10,
        letterSpacing:1,
     },
     modalBg:{
        position:'absolute',
        top:0,
        right:0,
        left:0,
        bottom:0,
        backgroundColor:color.MODAL_BG,
     }
});

//make this component available to the app
export default OptionModal;
