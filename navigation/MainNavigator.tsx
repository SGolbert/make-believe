import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import BottomTabNavigator from './BottomTabNavigator'
import StoryTopTabNavigator from './StoryTopTabNavigator'

const Stack = createStackNavigator()

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Story" component={StoryTopTabNavigator} />
    </Stack.Navigator>
  )
}
