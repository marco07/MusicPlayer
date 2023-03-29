
import React from 'react';
import { AntDesign  } from '@expo/vector-icons';
import color from '../misc/color';


const PlayerBottom = props => {
    const {iconType, size = 35, iconColor = color.FONT, onPress} = props;
    const getIconName = (type) =>{
        switch (type) {
            case 'PLAY':
                return 'pausecircle'
            case 'PAUSE':
                return 'play'
            case 'NEXT':
                return 'forward'
            case 'PREV':
                return 'banckward'
     
        }
    }
   



    return (
        <AntDesign {...props}  name={getIconName(iconType)} size={size} color = {iconColor}/>
    );
};


export default PlayerBottom;
