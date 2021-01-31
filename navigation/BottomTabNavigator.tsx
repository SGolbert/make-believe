import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import HomeScreen from '../screens/HomeScreen'
import StoriesScreen from '../screens/StoriesScreen'
import ConfigurationScreen from '../screens/ConfigurationScreen'

const BottomTab = createBottomTabNavigator()

const HomeStack = createStackNavigator()

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'Home' }}
      />
    </HomeStack.Navigator>
  )
}

const StoriesStack = createStackNavigator()

function StoriesNavigator() {
  return (
    <StoriesStack.Navigator>
      <StoriesStack.Screen
        name="StoriesScreen"
        component={StoriesScreen}
        options={{ headerTitle: 'Stories' }}
      />
    </StoriesStack.Navigator>
  )
}

const ConfigurationStack = createStackNavigator()

function ConfigurationNavigator() {
  return (
    <ConfigurationStack.Navigator>
      <ConfigurationStack.Screen
        name="ConfigurationScreen"
        component={ConfigurationScreen}
        options={{ headerTitle: 'Configuration' }}
      />
    </ConfigurationStack.Navigator>
  )
}

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon name="home" type="ionicon" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Stories"
        component={StoriesNavigator}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon name="book" type="ionicon" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Configuration"
        component={ConfigurationNavigator}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon name="construct" type="ionicon" color={color} size={30} />
          ),
        }}
      />
      {/* <BottomTab.Screen
        name="Adventure"
        component={AdventureNavigator}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon name="rocket" type="ionicon" color={color} size={30} />
          ),
        }}
      /> */}
    </BottomTab.Navigator>
  )
}
