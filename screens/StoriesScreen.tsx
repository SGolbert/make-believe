import * as React from 'react'
import styled from 'styled-components/native'
import { Text, Button, Icon } from 'react-native-elements'
import { StackScreenProps } from '@react-navigation/stack'

import { View } from '../components/Themed'

export default function StoriesScreen({
  navigation,
}: StackScreenProps<any, 'Not found'>) {
  return (
    <HomeScreenContainer>
      <Title h3>Your Stories</Title>
      <Button
        key={String(Math.random())}
        title="Go to your story"
        onPress={() => {
          navigation.navigate('Story')
        }}
        icon={<Icon name="golf" type="ionicon" color="white" />}
      />
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
