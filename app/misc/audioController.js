import { storeAudioForNextOpening } from './helper';


export const play = async (playbackObj, uri, lastPosition) => {
    try {
        if (!lastPosition) return await playbackObj.loadAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 1000, staysActiveInBackground: true }
      );
  
    await playbackObj.loadAsync(
        { uri },
        { progressUpdateIntervalMillis: 1000 }
      );
    return await playbackObj.playFromPositionAsync(lastPosition);
    }   
    catch (error) {
    console.log('error inside play helper method', error.message);
    }
};



export const pause = async (playbackObj) => {
    try {
        return await playbackObj.setStatusAsync({shouldPlay: false});
    }   
    catch (error) {
    console.log('error inside pause helper method', error.message);
    }
};



export const resume = async (playbackObj) => {
    try {
        return await playbackObj.playAsync();
    }   
    catch (error) {
    console.log('error inside resume helper method', error.message);
    }
};




export const playNext = async (playbackObj, uri) =>{
    try {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
       return await play(playbackObj, uri);
    } catch (error) {
        console.log('error inside next audio helper method', error.message);   
    }
 
}


export const selectAudio = async (audio, context, playListInfo = {}) => {
        const {playbackObj, soundObj, currentAudio, updateState, audiofiles, onPlaybackStatusUpdate} = context;
        
        try {
        

        if(soundObj === null){
        
            const status = await play(playbackObj, audio.uri, audio.lastPosition);
            const index = audiofiles.findIndex(({ id }) => id === audio.id);
            
            updateState(context, {currentAudio:audio, 
             soundObj: status, isPlaying:true, currentAudioIndex: index,
             isPlayListRunning: false, activePlayList: [],
            ...playListInfo});
        
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            return storeAudioForNextOpening(audio, index);
           
            }
        

            if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
              const status = await pause(playbackObj);
              return updateState(context, {soundObj:status, isPlaying: false, playbackPosition: status.positionMillis});
             
            }
            

        
            if(soundObj.isLoaded && !soundObj.isPlaying 
              && currentAudio.id === audio.id){
                const status = await resume(playbackObj);
                return updateState(context, {soundObj:status, isPlaying: true});
              
            }
        

            if (soundObj.isLoaded && currentAudio.id !== audio.id) {
              const status = await playNext(playbackObj, audio.uri);
              const index = audiofiles.findIndex(({id}) => id === audio.id);
              
              updateState(context, {currentAudio:audio, 
                soundObj: status, isPlaying: true, currentAudioIndex: index,
                isPlayingRunning: false, activePlayList: [],
                ...playListInfo});

                return storeAudioForNextOpening(audio, index);
            }
            
        } catch (error) {
            console.log('Error inside select audio method.', error.message)
        }

  
};



const selectAudioFromPlayList = async (context, select) =>{
    const {  activePlayList, currentAudio, audiofiles, playbackObj , updateState} = context;
                let audio;
                let defaultIndex;
                let nextIndex;

                const indexOnPlayList = activePlayList.audios.findIndex(({id}) => id === currentAudio.id);

                if(select === 'next'){
                    nextIndex = indexOnPlayList + 1;
                    defaultIndex = 0;
                }

                if(select === 'previous'){
                    nextIndex = indexOnPlayList - 1;
                    defaultIndex = activePlayList.audios.length - 1;
                }

                audio = activePlayList.audios[nextIndex];
                
                if(!audio) audio = activePlayList.audios[defaultIndex];

                const indexOnAllList = audiofiles.findIndex(({ id }) => id === audio.id);

                const status = await playNext(playbackObj, audio.uri);
                return updateState(context,{
                    soundObj: status,
                    isPlaying: true,
                    currentAudio: audio,
                    currentAudioIndex: indexOnAllList,

                })
}

export const changeAudio = async (context, select ) =>{
    const {playbackObj, currentAudioIndex, totalAudioCount, audiofiles, updateState, isPlayingRunning} = context;
    if (isPlayingRunning) return selectAudioFromPlayList(context, select);
    try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
    const isFirstAudio = currentAudioIndex <= 0;
    
    let audio;
    let  index;
    let status;
    

     if (select === 'next') {
        audio = audiofiles[currentAudioIndex + 1];
        if (!isLoaded && !isLastAudio) {
            index = currentAudioIndex + 1;
            status = await play(playbackObj, audio.uri);
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); 
        }
    
        if (isLoaded && !isLastAudio) {
            index = currentAudioIndex + 1;
            status = await playNext(playbackObj, audio.uri); 
        }
    
        if (isLastAudio) {
            index = 0;
            audio = audiofiles[index];
            if (isLoaded) {
                status = await playNext(playbackObj, audio.uri); 
            }else{
                status = await play(playbackObj, audio.uri); 
            }
        }
        
    }

  
    if (select === 'previous') {
        audio = audiofiles[currentAudioIndex - 1];
    if (!isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await play(playbackObj, audio.uri);
        playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);  
    }

    if (isLoaded && !isFirstAudio) {
        index = currentAudioIndex - 1;
        status = await playNext(playbackObj, audio.uri); 
    }

    if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audiofiles[index];
        if (isLoaded) {
            status = await playNext(playbackObj, audio.uri); 
        }else{
            status = await play(playbackObj, audio.uri); 
        }    
    }
    }
    updateState(context, {currentAudio:audio,  
        soundObj: status, 
        isPlaying:true, 
        currentAudioIndex: index,
        playbackPosition: null,
        playbackDuration: null,
    });

    storeAudioForNextOpening(audio, index);
        
    } catch (error) {
        console.log('Error inside change audio method.', error.message)
    }
    
        
};


export const moveAudio = async (context, value) =>{
    const {soundObj, isPlaying, playbackObj, updateState} = context;
    if(soundObj === null || !isPlaying) return;
    try {
       const status = await playbackObj.setPositionAsync(Math.floor(soundObj.durationMillis * value));

       updateState(context, {soundObj: status, playbackPosition: status.positionMillis})

       await resume(playbackObj);
       
    } catch (error) {
        console.log('error inside onSlidingComplete callback', error);
    }
}

