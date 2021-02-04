/* eslint-disable react-native/no-inline-styles */
import * as React from 'react'
import { View } from 'react-native'

import { Text, TextProps } from './Themed'

function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
}

export default MonoText
