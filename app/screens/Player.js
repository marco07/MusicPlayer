//import liraries
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Screen from '../components/Screen'
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerBottom from '../components/PlayerBottom';
import {AudioContext} from '../context/AudioProvider';

const { width } = Dimensions.get('window')
// create a component
const Player = () => {
    const context = useContext(AudioContext);
    const { playbackPosition, playbackDuration, } = context
    const calculateSeeBar = () =>{
        if(playbackPosition !== null && playbackDuration !== null){
            return playbackPosition / playbackDuration;
        }
        return 0;
    }

    return (<Screen>
        <View style={styles.container}> 
            <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${ context.totalAudioCount}`}</Text>
            <View style={styles.midBannerContainer}>
                <MaterialCommunityIcons name="music-circle" size={300} 
                color={ context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioTitle}>
                    {context.currentAudio.filename}
                </Text>
                <Slider style={{with:width, height:40}}
                    minimunValue={0}
                    maximunValue={1}
                    value = { calculateSeeBar() }
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}              
                />
                <View style={styles.audioControllers}>
                    <PlayerBottom iconType='PREV'/>
                    <PlayerBottom onPress={() => console.log('Playing') } 
                    style={{marginHorizontal: 30}} 
                    iconType={ context.isPlaying ? 'PLAY' : 'PAUSE'}/>
                    <PlayerBottom iconType='NEXT'/>
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
     audioCount: {
        textAlign:'right',
        padding:15,
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
