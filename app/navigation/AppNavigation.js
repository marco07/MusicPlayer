//import liraries
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import PlayListDetail from '../screens/PlayListDetail';
import { Ionicons, FontAwesome5, MaterialIcons  } from '@expo/vector-icons';
import color from '../misc/color';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlayListScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} >
      <Stack.Screen name='PlayListScreen' component={PlayList} />
      <Stack.Screen name='PlayListDetailScreen' component={PlayListDetail} />
    </Stack.Navigator>
  );
};


function LogoTitle() {
  return (
    <Image
      style={{ width: 35, height: 35 }}
      source={require('../../assets/pibc.png')}
    />

  );
}

const AppNavigator = () => {

    return <Tab.Navigator 
    screenOptions={({ route }) => ({
      headerShown: true,
      tabBarStyle: {
        height: 60,
        paddingHorizontal: 5,
        paddingTop: 0,

    },
  })}>
        <Tab.Screen  name='AudioList'  component={AudioList} options={{
          title: 'Audio List',
          headerTitle: (props) => <LogoTitle {...props}/> ,
          headerStyle: {
            backgroundColor: '#E79500',
          },
          headerTintColor: '#f1f1f1',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

            tabBarIcon:({focused, size}) =>{
                return <Ionicons name="headset" size={size} color={focused ? color.ACTIVE_BG : color.FONT_LIGHT_BAR} />
            },
            tabBarLabel: ({focused, color, size}) => (  
              <Text style={[{color: focused ? '#B60D00' : color.FONT_LIGHT_BAR}]} size={size} >{focused?"Audio List": ""}</Text>
            )
        }}/>
        <Tab.Screen  name='Player' component={Player} options={{
                title: 'Player',
                headerTitle: (props) => <LogoTitle {...props}/> ,
                headerStyle: {
                  backgroundColor: '#E79500',
                },
                headerTintColor: '#f1f1f1',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
            tabBarIcon:({ size, focused}) =>{
                 return <FontAwesome5 name="compact-disc" size={size} color={focused ? color.ACTIVE_BG : color.FONT_LIGHT_BAR} />
            },
            tabBarLabel: ({focused, color, size}) => (  
              <Text style={[{color: focused ? '#B60D00' : color.FONT_LIGHT_BAR}]} size={size} >{focused?"Play": ""}</Text>
            ),
        }}/>
        <Tab.Screen  name='PlayList' component={PlayListScreen} options={{
                title: 'PlayList',
                headerTitle: (props) => <LogoTitle {...props} /> ,
                headerStyle: {
                  backgroundColor: '#E79500',
                },
                headerTintColor: '#f1f1f1',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
            tabBarIcon:({ size, focused }) =>{
                 return <MaterialIcons  name="my-library-music" size={size} color={focused ? color.ACTIVE_BG : color.FONT_LIGHT_BAR} />
            },
            tabBarLabel: ({focused, color, size}) => (  
              <Text style={[{color: focused ? '#B60D00' : color.FONT_LIGHT_BAR}]} size={size}>{focused?"Play List": ""}</Text>
            ),
          
        }}/>

    </Tab.Navigator>
  
};


export default AppNavigator;
