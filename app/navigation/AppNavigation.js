//import liraries
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import PlayListDetail from '../screens/PlayListDetail';
import { Ionicons, FontAwesome5, MaterialIcons  } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PlayListScreen' component={PlayList} />
      <Stack.Screen name='PlayListDetailScreen' component={PlayListDetail} />
    </Stack.Navigator>
  );
};

// create a component 
const AppNavigator = () => {
    return <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen  name='Audio List'  component={AudioList} options={{
            tabBarIcon:({color, size}) =>{
                return <Ionicons name="headset" size={size} color={color} />
            }
        }}/>
        <Tab.Screen  name='Player' component={Player} options={{
            tabBarIcon:({color, size}) =>{
                 return <FontAwesome5 name="compact-disc" size={size} color={color} />
            }
        }}/>
        <Tab.Screen  name='PlayList' component={PlayListScreen} options={{
            tabBarIcon:({color, size}) =>{
                 return <MaterialIcons  name="my-library-music" size={size} color={color} />
            }
        }}/>

    </Tab.Navigator>
};



export default AppNavigator;
