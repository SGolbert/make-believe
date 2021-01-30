import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import AdventureScreen from '../screens/AdventureScreen'
import HomeScreen from '../screens/HomeScreen'

const BottomTab = createBottomTabNavigator()

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const AdventureStack = createStackNavigator()

function AdventureNavigator() {
  return (
    <AdventureStack.Navigator>
      <AdventureStack.Screen
        name="AdventureScreen"
        component={AdventureScreen}
        options={{ headerTitle: 'Adventure' }}
      />
    </AdventureStack.Navigator>
  )
}

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

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
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
        name="Adventure"
        component={AdventureNavigator}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon name="rocket" type="ionicon" color={color} size={30} />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
}
