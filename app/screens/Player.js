//import liraries
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Screen from '../components/Screen'
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerBottom from '../components/PlayerBottom';
import {AudioContext} from '../context/AudioProvider';
import {changeAudio, moveAudio, pause, play, playNext, resume, selectAudio} from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';


const { width } = Dimensions.get('window')
// create a component
const Player = () => {
    const [currentPosition, setCurrentPosition ] = useState(0);
    const context = useContext(AudioContext);
    const { playbackPosition, playbackDuration,currentAudio } = context;

    const calculateSeeBar = () =>{
        if(playbackPosition !== null && playbackDuration !== null){
            return playbackPosition / playbackDuration;
        }
        if (currentAudio.lastPosition) {
            return currentAudio.lastPosition / (currentAudio.duration * 1000);
          }

        return 0;
    }

    useEffect(()=>{
        context.loadPreviusAudio();
        //console.log(context.currentAudio);
    }, []);

   const handlePlayPause = async () =>{
    await selectAudio(context.currentAudio, context);
    // // play
    // if (context.soundObj === null) {
    //     const audio = context.currentAudio;
    //     const status = await play(context.playbackObj, audio.uri);
    //     context.playbackObj.setOnPlaybackStatusUpdate(context.onPlaybackStatusUpdate);

    //     return context.updateState(context, {
    //         soundObj: status,
    //         currentAudio: audio,
    //         isPlaying: true,
    //         currentAudioIndex: context.currentAudioIndex

    //     });
    // }
    // // pause
    // if(context.soundObj && context.soundObj.isPlaying){
    //     const status = await pause(context.playbackObj);
    //     return context.updateState(context, {
    //         soundObj: status,
    //         isPlaying: false,

    //     });  
    // }

    // // resume
    // if(context.soundObj && !context.soundObj.isPlaying){
    //     const status = await resume(context.playbackObj);
    //     return context.updateState(context, {
    //         soundObj: status,
    //         isPlaying: true,

    //     });  
    // }
   };

const handleNext = async () => {
    await changeAudio(context, 'next');
    // const { isLoaded } = await context.playbackObj.getStatusAsync();
    // const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;

    // let audio = context.audiofiles[context.currentAudioIndex + 1];
    // let  index;
    // let status;

    // if (!isLoaded && !isLastAudio) {
    //     index = context.currentAudioIndex + 1;
    //     status = await play(context.playbackObj, audio.uri); 
    // }

    // if (isLoaded && !isLastAudio) {
    //     index = context.currentAudioIndex + 1;
    //     status = await playNext(context.playbackObj, audio.uri); 
    // }

    // if (isLastAudio) {
    //     index = 0;
    //     audio = context.audiofiles[index];
    //     if (isLoaded) {
    //         status = await playNext(context.playbackObj, audio.uri); 
    //     }else{
    //         status = await play(context.playbackObj, audio.uri); 
    //     }
        
        
    // }

    // context.updateState(context, {currentAudio:audio, 
    //     playbackObj: context.playbackObj, 
    //     soundObj: status, 
    //     isPlaying:true, 
    //     currentAudioIndex: index,
    //     playbackPosition: null,
    //     playbackDuration: null,
    // });

    // storeAudioForNextOpening(audio, index);

};

const handlePrevious = async () => {
     await changeAudio(context, 'previous');
    // const { isLoaded } = await context.playbackObj.getStatusAsync();
    // const isFirstAudio = context.currentAudioIndex <= 0;

    // let audio = context.audiofiles[context.currentAudioIndex - 1];
    // let  index;
    // let status;

    // if (!isLoaded && !isFirstAudio) {
    //     index = context.currentAudioIndex - 1;
    //     status = await play(context.playbackObj, audio.uri); 
    // }

    // if (isLoaded && !isFirstAudio) {
    //     index = context.currentAudioIndex - 1;
    //     status = await playNext(context.playbackObj, audio.uri); 
    // }

    // if (isFirstAudio) {
    //     index = context.totalAudioCount - 1;
    //     audio = context.audiofiles[index];
    //     if (isLoaded) {
    //         status = await playNext(context.playbackObj, audio.uri); 
    //     }else{
    //         status = await play(context.playbackObj, audio.uri); 
    //     }    
    // }

    // context.updateState(context, {currentAudio:audio, 
    //     playbackObj: context.playbackObj, 
    //     soundObj: status, 
    //     isPlaying:true, 
    //     currentAudioIndex: index,
    //     playbackPosition: null,
    //     playbackDuration: null,
    // });

    // storeAudioForNextOpening(audio, index);

   };
   const renderCurrentTime = () => {
   if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

    if (!context.currentAudio) return null;

    return (<Screen>
        <View style={styles.container}> 
        <View style={styles.audioCountContainer}>
          <View style={{flexDirection:'row'}}>
           {context.isPlayingRunning && (
            <>
              <Text style={{fontWeight:'bold'}}>From PlayList: </Text>
              <Text>{context.activePlayList.title}</Text>
            </>
            
           )}
           </View>
           <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${ context.totalAudioCount}`}</Text>
        </View>
            
            <View style={styles.midBannerContainer}>
                <MaterialCommunityIcons name="music-circle" size={300} 
                color={ context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioTitle}>
                    {context.currentAudio.filename}
                </Text>
                <View style={{flexDirection:'row', justifyContent: 'space-between', paddingHorizontal:15}}>
                    <Text>{convertTime(context.currentAudio.duration)}</Text>
                    <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
                </View>
                <Slider style={{with:width, height:40}}
                    minimunValue={0}
                    maximunValue={1}
                    value = { calculateSeeBar() }
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                    onValueChange={value => {
                        setCurrentPosition(
                          convertTime(value * context.currentAudio.duration)
                        );
                      }}
                      onSlidingStart={async () => {
                        if (!context.isPlaying) return;
          
                        try {
                          await pause(context.playbackObj);
                        } catch (error) {
                          console.log('error inside onSlidingStart callback', error);
                        }
                      }}
                      onSlidingComplete={ async value => {
                        await moveAudio(context, value);
                        setCurrentPosition(0);
                      }}             
                />
                <View style={styles.audioControllers}>
                    <PlayerBottom iconType='PREV' onPress={ handlePrevious }/>
                   
                    <PlayerBottom onPress={ handlePlayPause } 
                    style={{marginHorizontal: 30}} 
                    iconType={ context.isPlaying ? 'PLAY' : 'PAUSE'}
                    />
                   
                    <PlayerBottom iconType='NEXT' onPress={ handleNext } />
                </View>
            </View>
        </View>
    </Screen>)
};

// define your styles
const styles = StyleSheet.create({
    audioControllers:{
        width,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        paddingBottom: 25,
    },
    container: {
        flex: 1,
     },
     audioCountContainer:{
       flexDirection:'row',
       justifyContent:'space-between',
       paddingHorizontal: 15,
     },
     audioCount: {
        textAlign:'right',
        color:color.FONT_LIGHT,
        fontSize:14,
     },
     midBannerContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
     },
     audioTitle:{
        fontSize:16,
        color:color.FONT,
        padding:20,
     }
});

//make this component available to the app
export default Player;
