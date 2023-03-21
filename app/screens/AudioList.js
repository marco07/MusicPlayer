import { Text, View, StyleSheet, ScrollView } from 'react-native'
import React, { Component } from 'react'
import {AudioContext} from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider} from 'recyclerlistview';
import { Dimensions } from 'react-native';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import {pause, play, playNext, resume, selectAudio} from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';



export class AudioList extends Component { 
  static contextType = AudioContext

  constructor(props){
    super(props);
    this.state = {
      OptionModalVisible: false,
    };
    this.currentItem ={};
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

  // onPlaybackStatusUpdate = async playbackStatus => {
  //   if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
  //     this.context.updateState(this.context, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,

  //     });    
  //   }
  //   if (playbackStatus.didJustFinish) {
  //     const nextAudioIndex = this.context.currentAudioIndex + 1;
      
  //     // there is no next audio to play or current audio is the last

  //   if (nextAudioIndex >= this.context.totalAudioCount) {
  //      this.context.playbackObj.unloadAsync();
  //      this.context.updateState(this.context, {
  //       soundObj: null,
  //       currentAudio: this.context.audiofiles[0],
  //       isPlaying: false,
  //       currentAudioIndex: 0,
  //       playbackPosition: null,
  //       playbackDuration: null,
  //     });
  //     return await storeAudioForNextOpening(this.context.audiofiles[0], 0);
  //   }

  //     // otherwise we want to select next audio
  //     const audio = this.context.audiofiles[nextAudioIndex];
  //     const status =  await playNext(this.context.playbackObj, audio.uri);
  //     this.context.updateState(this.context, {
  //       soundObj: status,
  //       currentAudio: audio,
  //       isPlaying: true,
  //       currentAudioIndex: nextAudioIndex,
  //     });
  //     await storeAudioForNextOpening(audio, nextAudioIndex);
  //   }
  // }

  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);
    // const {playbackObj, soundObj, currentAudio, updateState, audiofiles} = this.context;
    // //playing audio for the firts time
    // if(soundObj === null){
    // const playbackObj = new Audio.Sound()
    // const status = await play(playbackObj, audio.uri);
    // const index = audiofiles.indexOf(audio);

    // updateState(this.context, {currentAudio:audio, 
    //   playbackObj: playbackObj, soundObj: status, isPlaying:true, currentAudioIndex: index});

    //   playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate);
    //   return storeAudioForNextOpening(audio, index);
   
    // }

    // //pause audio
    // if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
    //   const status = await pause(playbackObj);
    //   return updateState(this.context, {soundObj:status, isPlaying: false});
     
    // }
    
    // //resumen audio

    // if(soundObj.isLoaded && !soundObj.isPlaying 
    //   && currentAudio.id === audio.id){
    //     const status = await resume(playbackObj);
    //     return updateState(this.context, {soundObj:status, isPlaying: true});
      
    // }

    // //select another audio
    // if (soundObj.isLoaded && currentAudio.id !== audio.id) {
    //   const status = await playNext(playbackObj, audio.uri);
    //   const index = audiofiles.indexOf(audio)
    //   updateState(this.context, {currentAudio:audio, 
    //     soundObj: status, isPlaying: true, currentAudioIndex: index});
    //   return storeAudioForNextOpening(audio, index);
    // }
  }

  componentDidMount(){
    this.context.loadPreviusAudio();
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
  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem,
    });
    this.props.navigation.navigate('PlayList');
  };

  render() {
    return <AudioContext.Consumer>
        {({dataProvider, isPlaying}) => {
            if (!dataProvider._data.length) return null;
            return (
            <Screen>
                <RecyclerListView dataProvider={dataProvider} 
                  layoutProvider={this.layoutProvider} 
                  rowRenderer={this.rowRenderer}
                  extendedState={{isPlaying}}
                />
                <OptionModal
                  onPlayPress={() => console.log('Playing audio')}
                  onPlayListPress={() =>{
                    this.context.updateState(this.context,{
                      addToPlayList: this.currentItem,
                    });

                    this.props.navigation.navigate('PlayList');

                  }} 
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