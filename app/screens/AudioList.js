import { Text, View, StyleSheet,  TextInput, FlatList } from 'react-native'
import React, { Component, useEffect, useState, useContext} from 'react'
import {AudioContext} from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
import { Dimensions } from 'react-native';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import {pause, play, playNext, resume, selectAudio} from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';
import color from '../misc/color';



export class AudioList extends Component { 
  static contextType = AudioContext
 
  constructor(props){
    super(props);
    this.state = {
      OptionModalVisible: false,
      searchValue:"",
      data:[]
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
    this.setState({ searchValue: "" });

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
         
          
           if (!dataProvider._data.length) return this.state.data;
     
            searchName = (input) =>{
              let data = dataProvider._data.map(item => item);
              let searchData = data.filter((item) => {
                const item_data = `${item.filename.toUpperCase()})`;  
                  
                const text_data = input.toUpperCase();
                return item_data.indexOf(text_data) > -1;
              }); 
              
              this.setState({ data: searchData, searchValue: input });
              //console.log(this.state.data)
            
            }

            return (
              
              <>
               <TextInput style={styles.input} placeholder={'Search audio ...'} 
                 value={this.state.searchValue}
                 onChangeText={(input) => searchName(input)} />
               
                <Screen> 
               
                
              { this.state.data.length == 0 || !this.state.searchValue ?
                 //console.log(this.state.data)
                 <RecyclerListView dataProvider={ dataProvider } 
                  layoutProvider={this.layoutProvider} 
                  rowRenderer={this.rowRenderer}
                  extendedState={{isPlaying}}
                  />
                :
              //console.log(this.state.data)
                <FlatList data={ this.state.data } 
                layoutProvider={this.layoutProvider} 
                renderItem={({item}) =>(
                  <View style={{marginBottom: 10}}>
         
                    <AudioListItem title={item.filename}
                    isPlaying= {this.extendedState}
                    activeListItem={this.context.currentAudioIndex === this.index}
                    duration={item.duration}
                    onAudioPress={() => this.handleAudioPress(item)} 
                    onOptionPress={() => {
                        this.currentItem = item;
                        this.setState({...this.state, OptionModalVisible:true})
                    }}/>
 
                  </View>
              )}/>
                
               }
                        
               
                <OptionModal

                  options={[{title: ' Add to playlist', onPress: this.navigateToPlaylist}]} 
                  onClose={() => this.setState({...this.state, OptionModalVisible:false}) } 
                  visible={this.state.OptionModalVisible}
                  currentItem={this.currentItem}
                />
            </Screen>
           </>
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

    input: {
     
      borderBottomWidth: 1,
      height:45,
      borderBottomColor: color.ACTIVE_BG,
      fontSize: 18,
      paddingVertical: 5,
      justifyContent: 'center',
      alignItems: 'center',
      margin:20,
    },

});

export default AudioList