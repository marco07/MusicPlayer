import React, {useContext, useState} from "react";
import { View, StyleSheet, Modal, Text, FlatList, Dimensions, TouchableOpacity} from "react-native";
import AudioListItem from '../components/AudioListItem';
import { selectAudio } from '../misc/audioController';
import { AudioContext } from '../context/AudioProvider';
import OptionModal from "../components/OptionModal";
import color from '../misc/color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons'; 
import { ListItem, SearchBar } from "react-native-elements";
import filter from "lodash.filter";


const PlayListDetail = props => {
    const context = useContext(AudioContext);
    const playList = props.route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setselectedItem] = useState({});
    const [audios, setAudios] = useState(playList.audios);
    



    const closeModal = () =>{
        setselectedItem({}),
        setModalVisible(false)
    }
    const removeAudio = async () =>{
        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if(context.isPlayingRunning && context.currentAudio.id === selectedItem.id){
          
            await context.playbackObj.stopAsync();
            await context.playbackObj.unloadAsync();
            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];
        }
        const newAudios = audios.filter(audio => audio.id !== selectedItem.id);
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const oldPlayList = JSON.parse(result);
           const updatedPlayList = oldPlayList.filter((item) => {
                if (item.id === playList.id) {
                    item.audios = newAudios;
                }
                return item;
            });
            AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayList));
            context.updateState(context, {playList: updatedPlayList, isPlayListRunning, 
                activePlayList, playbackPosition, isPlaying, soundObj});
        }
        setAudios(newAudios);
        closeModal();
    };

    const removePlayList = async () =>{
        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if(context.isPlayingRunning && activePlayList.id === playList.id){
            
            await context.playbackObj.stopAsync();
            await context.playbackObj.unloadAsync();
            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];
        }
      
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {

           const oldPlayList = JSON.parse(result);
           const updatedPlayList = oldPlayList.filter( item => item.id !== playList.id);

            AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayList));
            context.updateState(context, {playList: updatedPlayList, isPlayListRunning, 
                activePlayList, playbackPosition, isPlaying, soundObj});
        }
       
        props.navigation.goBack();
      
    };


    const playAudio = async audio =>{
       await selectAudio(audio, context,{activePlayList: playList, isPlayingRunning: true});
    }
                 


    this.state = {
        loading: false,
        data: audios,

      };
    
    
  


    return (
   
            <>
            <View style={styles.container}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                }}>
                    <Text style={styles.title}>{playList.title}</Text>
                    <TouchableOpacity onPress={removePlayList}>
                        <Text style={{color:'#C02B00', fontSize:16,paddingVertical: 10,}}><FontAwesome name="trash" size={24} color="red" /> Remove</Text>
                    </TouchableOpacity>
                    
                </View>
         
            {audios.length ?   <FlatList
                contentContainerStyle = {styles.listContainer}
                data={this.state.data} keyExtractor={item => item.id.toString()}
                renderItem={({item}) =>(
                    <View style={{marginBottom: 10}}>
           
                      <AudioListItem title={item.filename} 
                      duration={item.duration}
                      isPlaying={context.isPlaying}
                      activeListItem = {item.id === context.currentAudio.id} 
                      onAudioPress = {() => playAudio(item)}
                      onOptionPress={() =>{
                        setselectedItem(item),
                        setModalVisible(true)
                      }} />
                    </View>
                )}/>:<Text style={{fontWeight:'bold', color: color.FONT_LIGHT, fontSize:14, paddingTop:30}}>
                    No registered audios were found in the playlist
                    </Text>}
            </View>



            <OptionModal visible={modalVisible} 
            onClose={closeModal} 
            options={[{title: '  Remove from playlist', onPress: removeAudio}]} 
            currentItem={selectedItem}/>
            </>
 
    );
};


const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
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
