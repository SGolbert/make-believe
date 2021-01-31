import * as React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import AdventureScreen from '../screens/AdventureScreen'

const AdventureTopTab = createMaterialTopTabNavigator()

export default function AdventureNavigator() {
  return (
    <AdventureTopTab.Navigator>
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
