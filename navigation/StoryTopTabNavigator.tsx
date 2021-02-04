import * as React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import AdventureScreen from '../screens/AdventureScreen'

export default function AdventureNavigator() {
  const AdventureTopTab = createMaterialTopTabNavigator()
  const insets = useSafeAreaInsets()

  return (
    <AdventureTopTab.Navigator
      tabBarOptions={{
        style: {
          marginTop: insets.top,
        },
      }}
    >
      <AdventureTopTab.Screen
        name="AdventureScreen"
        component={AdventureScreen}
      />
      <AdventureTopTab.Screen
        name="AdventureScreen2"
        component={AdventureScreen}
      />
    </AdventureTopTab.Navigator>
  )
}
