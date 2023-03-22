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

 

  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);

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

                  options={[{title: ' Add to playlist', onPress: this.navigateToPlaylist}]} 
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
});

export default AudioList