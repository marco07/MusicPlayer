import { Text, View, StyleSheet, ScrollView } from 'react-native'
import React, { Component } from 'react'
import {AudioContext} from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider} from 'recyclerlistview';
import { Dimensions } from 'react-native';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import {pause, play, playNext, resume} from '../misc/audioController'


export class AudioList extends Component { 
  static contextType = AudioContext

  constructor(props){
    super(props);
    this.state = {
      OptionModalVisible: false,
    };
    this.currentItem ={}
  }

  layoutProvider = new LayoutProvider(i => 'audio',(type, dim) =>{
    switch (type) {
        case 'audio':
            dim.width = Dimensions.get('window').width;
            dim.height = 70;
            break;
    
        default:
            dim.width = 0;
            dim.height = 0;
            break;
    }
   
  });

  handleAudioPress = async audio => {
    const {playbackObj, soundObj, currentAudio, updateState, audiofiles} = this.context;
    //playing audio for the firts time
    if(soundObj === null){
    const playbackObj = new Audio.Sound()
    const status = await play(playbackObj, audio.uri);
    const index = audiofiles.indexOf(audio)

    return updateState(this.context, {currentAudio:audio, 
      playbackObj: playbackObj, soundObj: status, isPlaying:true, currentAudioIndex: index});
   
    }

    //pause audio
    if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
      const status = await pause(playbackObj);
      return updateState(this.context, {soundObj:status, isPlaying: false});
     
    }
    
    //resumen audio

    if(soundObj.isLoaded && !soundObj.isPlaying 
      && currentAudio.id === audio.id){
        const status = await resume(playbackObj);
        return updateState(this.context, {soundObj:status, isPlaying: true});
      
    }

    //select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audiofiles.indexOf(audio)
      return updateState(this.context, {currentAudio:audio, 
        soundObj: status, isPlaying: true, currentAudioIndex: index});
    }

    
    
  }

  rowRenderer = (type, item, index, extendedState) =>{
  
    return <AudioListItem title={item.filename}
    isPlaying= {extendedState.isPlaying}
    activeListItem={this.context.currentAudioIndex === index}
    duration={item.duration}
    onAudioPress={() => this.handleAudioPress(item)} 
    onOptionPress={() => {
        this.currentItem = item;
        this.setState({...this.state, OptionModalVisible:true})
    }}/>
  }

  render() {
    return <AudioContext.Consumer>
        {({dataProvider, isPlaying}) => {
            return (
            <Screen>
                <RecyclerListView dataProvider={dataProvider} 
                  layoutProvider={this.layoutProvider} 
                  rowRenderer={this.rowRenderer}
                  extendedState={{isPlaying}}
                />
                <OptionModal
                  onPlayPress={() => console.log('Playing audio')}
                  onPlayListPress={() => console.log('Add PlayList audio')}  
                  onClose={() => this.setState({...this.state, OptionModalVisible:false}) } 
                  visible={this.state.OptionModalVisible}
                  currentItem={this.currentItem}
                />
            </Screen>
           
            );
        }}
    </AudioContext.Consumer>
  
  }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
});

export default AudioList