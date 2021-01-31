import * as React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { Text } from 'react-native-elements'

import { View } from '../components/Themed'

export default function HomeScreen() {
  const homeScreenImage = require('../assets/images/homescreen.jpg')

  return (
    <HomeScreenContainer>
      <Title h3>Welcome to Make Believe!</Title>
      <Image source={homeScreenImage} />
    </HomeScreenContainer>
  )
}

const HomeScreenContainer = styled(View).attrs({
  flex: 1,
  alignItems: 'center',
})``

const Title = styled(Text).attrs({
  h3Style: {
    fontWeight: 'bold',
    paddingVertical: 20,
  },
})``
