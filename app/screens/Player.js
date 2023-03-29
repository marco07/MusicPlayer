//import liraries
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Screen from '../components/Screen'
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerBottom from '../components/PlayerBottom';
import {AudioContext} from '../context/AudioProvider';
import {changeAudio, moveAudio, pause, play, playNext, resume, selectAudio} from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';
import * as Animatable from 'react-native-animatable'


const { width } = Dimensions.get('window') /1.5

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
      
   


    }, []);

   const handlePlayPause = async () =>{
    await selectAudio(context.currentAudio, context);
  
   };

const handleNext = async () => {
    await changeAudio(context, 'next');


};

const handlePrevious = async () => {
     await changeAudio(context, 'previous');


   };
   const renderCurrentTime = () => {
   if (!context.soundObj && currentAudio.lastPosition) {
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

    if (!context.currentAudio) return null;

    const thumbImage = require('../../assets/play.png');
    return (<Screen>
        <View style={styles.container}> 
        <View style={styles.audioCountContainer}>
        <View style={{flexDirection:'column'}}>
           {context.isPlayingRunning && (
            <>
             <Text style={{ fontSize:13}}>Playlist: </Text>
              <Text style={{fontWeight:'bold'}}>{context.activePlayList.title}</Text>
              
            </>
            
           )}
           </View>
           <Text style={styles.audioCount}> {`${context.currentAudioIndex + 1} / ${ context.totalAudioCount}`}</Text>
        </View>
                   
            <View style={styles.midBannerContainer}>
            
            <Animatable.Text animation={context.isPlaying ? "pulse" : "" } easing="ease-out" iterationCount="infinite"> <MaterialCommunityIcons name="music-circle" size={260} 
                color={ context.isPlaying ? color.ACTIVE_BG : color.FONT_LIGHT} /></Animatable.Text>
            </View>
            <View style={styles.audioPlayerContainer}>
            
                <Text numberOfLines={2} style={styles.audioTitle}>
                    {context.currentAudio.filename} 
                </Text>
                <View style={{flexDirection:'row', justifyContent: 'space-between', paddingHorizontal:16, marginTop:5}}>
                    <Text style={{color:color.FONT_LIGHT}}>{convertTime(context.currentAudio.duration)}</Text>
                    <Text style={{color:color.FONT_LIGHT}}> - {currentPosition ? currentPosition : renderCurrentTime()}</Text>                  
                </View>
                <Slider
                   style={{with:width - 20, height:40, padding:20}}
                    minimunValue={0}
                    maximunValue={1}
                    value = { calculateSeeBar() }
                    minimumTrackTintColor={color.ACTIVE_BG}
                    maximumTrackTintColor={color.FONT_MEDIUM}
                    thumbImage={thumbImage}
                 
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
                    <TouchableOpacity onPress={ handlePrevious }>
                      <PlayerBottom iconType='PREV' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ handlePlayPause }>
                      <PlayerBottom  
                    style={{marginHorizontal: 50, fontSize:55}} 
                    iconType={ context.isPlaying ? 'PLAY' : 'PAUSE'}
                    />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={ handleNext } >
                     <PlayerBottom iconType='NEXT' />
                    </TouchableOpacity>

                    
                </View>
                
            </View>
         
        </View>
    </Screen>)
};


const styles = StyleSheet.create({
    audioControllers:{
        width,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    container: {
        flex: 1,
     },
     audioCountContainer:{
       flexDirection:'row',
       justifyContent:'space-between',
       paddingHorizontal: 15,
     },
     audioPlayerContainer:{
      marginVertical:-20,
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
        fontSize:13,
        color:color.FONT,
        padding:20,
        fontWeight:'500'

     }
});


export default Player;