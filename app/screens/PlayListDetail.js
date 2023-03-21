import React, {useContext} from "react";
import { View, StyleSheet, Modal, Text, FlatList, Dimensions, TouchableWithoutFeedback } from "react-native";
import AudioListItem from '../components/AudioListItem';
import { selectAudio } from '../misc/audioController';
import { AudioContext } from '../context/AudioProvider';
import color from '../misc/color';


const PlayListDetail = props => {
    const context = useContext(AudioContext);
    const playList = props.route.params;
    const playAudio = async audio =>{
       await selectAudio(audio, context,{activePlayList: playList, isPlayingRunning: true});
    }
    return (
   
            <>
            <View style={styles.container}>
                <Text style={styles.title}>{playList.title}</Text>
                <FlatList
                contentContainerStyle = {styles.listContainer}
                data={playList.audios} keyExtractor={item => item.id.toString()}
                renderItem={({item}) =>(
                    <View style={{marginBottom: 10}}>
                      
                      <AudioListItem title={item.filename} 
                      duration={item.duration}
                      isPlaying={context.isPlaying}
                      activeListItem = {item.id === context.currentAudio.id} 
                      onAudioPress = {() => playAudio(item)} />
                    </View>
                )}/>
            </View>
            </>
 
    );
};


const styles = StyleSheet.create({
    container:{
        alignSelf: 'center',
    },

    listContainer:{
        padding: 20,
    },
    title:{
        textAlign:'center',
        fontSize: 20,
        paddingVertical: 10,
        fontWeight:'bold',
        color: color.ACTIVE_BG,
    },
});
export default PlayListDetail;
