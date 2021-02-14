import * as React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { Button, Text } from 'react-native-elements'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import { View } from '../components/Themed'

// @ts-ignore: Import from JS file
import awsconfig from '../amplify/aws-exports'
import { createTodo } from '../amplify/graphql/mutations'
import { listTodos } from '../amplify/graphql/queries'
import { onCreateTodo } from '../amplify/graphql/subscriptions'

Amplify.configure(awsconfig)

async function getData() {
  const evt = await API.graphql(graphqlOperation(listTodos))
  return evt.data.listTodos.items
}

async function createNewTodo() {
  const todo = {
    name: 'Use AppSync',
    description: `Realtime and Offline (${new Date().toLocaleString()})`,
  }

  const resp = await API.graphql(graphqlOperation(createTodo, { input: todo }))
  console.log(resp)
  return resp
}

export default function HomeScreen() {
  const homeScreenImage = require('../assets/images/homescreen.jpg')
  const [notes, setnotes] = React.useState<any[]>([])

  const fetchNotes = async () => {
    const res = await getData()
    setnotes(res)
    console.log('FETCH', res)
  }

  React.useEffect(() => {
    API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (evt) => {
        const todo = evt.value.data.onCreateTodo
        console.log('SUBSCRIBED  UPDATE', todo)
        setnotes((oldNotes) => [...oldNotes, todo])
      },
    })
  }, [])

  return (
    <HomeScreenContainer>
      <Title h3>Welcome to Make Believe!</Title>
      {/* <Image source={homeScreenImage} /> */}
      {notes.map((note) => (
        <View key={Math.random()}>
          <Text>{note.description}</Text>
        </View>
      ))}
      <Button title="AWS" onPress={createNewTodo} />
      <Button title="AWS-Fetch" onPress={fetchNotes} />
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
