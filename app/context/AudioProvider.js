import { Text, View, Alert } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary  from 'expo-media-library';
import {DataProvider} from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import { playNext } from '../misc/audioController';


export const AudioContext = createContext();

export class AudioProvider extends Component {
       
    constructor(props){
        super(props);

        this.state ={
            audiofiles:[],
            playList:[],
            addToPlayList: null,
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio:{},
            isPlaying: false,
            isPlayingRunning: false,
            activePlayList: [],
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null,

            
        };
        this.totalAudioCount = 0;
    }

    permissionAlert = () =>{
        Alert.alert("Permission Required", "This app need to read audio files !", [{
            text:"I am ready",
            onPress: () => this.getPermission()
        },{
            text:"Cancel",
            onPress: () => this.permissionAlert()
        }
    ]);

    }

    getAudioFiles = async () =>{
       const {dataProvider, audiofiles} = this.state

       let media =  await MediaLibrary.getAssetsAsync(
            { mediaType:'audio', }
        );

        media =  await MediaLibrary.getAssetsAsync(
            {
                mediaType:'audio',
                first: media.totalCount

            }
        );

        this.totalAudioCount = media.totalCount;

        this.setState({
            ...this.state, 
            dataProvider: dataProvider.cloneWithRows([
                ...audiofiles, 
                ...media.assets]), 

            audiofiles: [...audiofiles, ...media.assets]});

    }

    loadPreviusAudio = async () => {

        let previousAudio = await AsyncStorage.getItem('previousAudio');
        let currentAudio;
        let currentAudioIndex;

        if (previousAudio === null) {
            currentAudio = this.state.audiofiles[0];
            currentAudioIndex = 0;
            
        }else{
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
        }
        this.setState({...this.state, currentAudio, currentAudioIndex});

    }

    getPermission = async () =>{

        const permission = await MediaLibrary.getPermissionsAsync();
        if(permission.granted){

            this.getAudioFiles();
        }

        if (!permission.canAskAgain && !permission.granted) {
            this.setState({...this.state, permissionError:true});
        }

        if(!permission.granted && permission.canAskAgain){
           const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();
           
           if (status === 'denied' && canAskAgain) {
           
            this.permissionAlert();
           }

           if (status === 'granted') {
            
            this.getAudioFiles();
            
           }

           if (status === 'denied' && !canAskAgain) {
            
            this.setState({...this.state, permissionError:true});
           }

        }
    }

    onPlaybackStatusUpdate = async playbackStatus => {
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
          this.updateState(this, {
            playbackPosition: playbackStatus.positionMillis,
            playbackDuration: playbackStatus.durationMillis,
    
          });    
        }

        if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
           storeAudioForNextOpening(this.state.currentAudio, this.state.currentAudioIndex,
            playbackStatus.positionMillis);
        }


        if (playbackStatus.didJustFinish) {
            if (this.state.isPlayingRunning) {
                let audio;
                const indexOnPlayList = this.state.activePlayList.audios.findIndex(({id})=> id === this.state.currentAudio.id);
                const nextIndex = indexOnPlayList + 1;
                audio = this.state.activePlayList.audios[nextIndex];
                
                if(!audio) audio = this.state.activePlayList.audios[0];

                const indexOnAllList = this.state.audiofiles.findIndex(({id})=> id === audio.id)

                const status = await playNext(this.state.playbackObj, audio.uri);
                return this.updateState(this,{
                    soundObj: status,
                    isPlaying: true,
                    currentAudio: audio,
                    currentAudioIndex: indexOnAllList

                });

            }
          const nextAudioIndex = this.state.currentAudioIndex + 1;
          

    
        if (nextAudioIndex >= this.totalAudioCount) {
           this.state.playbackObj.unloadAsync();
           this.updateState(this, {
            soundObj: null,
            currentAudio: this.state.audiofiles[0],
            isPlaying: false,
            currentAudioIndex: 0,
            playbackPosition: null,
            playbackDuration: null,
          });

          
          return await storeAudioForNextOpening(this.state.audiofiles[0], 0);
        }
    
    
          const audio = this.state.audiofiles[nextAudioIndex];
          const status =  await playNext(this.state.playbackObj, audio.uri);
          this.updateState(this, {
            soundObj: status,
            currentAudio: audio,
            isPlaying: true,
            currentAudioIndex: nextAudioIndex,
          });
          await storeAudioForNextOpening(audio, nextAudioIndex);
        }
      }

    async componentDidMount(){
        this.getPermission();
        if (this.state.playbackObj === null) {
            this.setState({...this.state, playbackObj: new Audio.Sound()})
        }
        await Audio.setIsEnabledAsync(true);
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
            
        });
       
    }
    

    updateState = (prevState, newState = {}) => {
        this.setState({...prevState, ...newState})
    }

    
  render() {
    const {audiofiles, playList, addToPlayList, dataProvider, permissionError, 
        playbackObj, soundObj, currentAudio, 
        isPlaying, currentAudioIndex, playbackPosition, 
        playbackDuration, isPlayingRunning, activePlayList} = this.state
    if (permissionError) return<View style={{
        
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            
        
    }}>
        <Text style={{fontSize: 25, textAlign:'center', color:'red'}}>It looks like you haven't accept the permission</Text>
    </View>
    return <AudioContext.Provider value={{audiofiles, playList, addToPlayList, dataProvider, 
    playbackObj, soundObj, currentAudio, isPlaying,currentAudioIndex,  
    totalAudioCount: this.totalAudioCount,playbackPosition, playbackDuration,
    isPlayingRunning, activePlayList,
    updateState: this.updateState,
    loadPreviusAudio: this.loadPreviusAudio,
    onPlaybackStatusUpdate: this.onPlaybackStatusUpdate}}>
    
    {this.props.children}
    </AudioContext.Provider>
  }
}

export default AudioProvider