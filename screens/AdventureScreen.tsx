/* eslint-disable react-native/no-inline-styles */
import * as React from 'react'
import { ScrollView } from 'react-native'
import {
  Icon,
  Button,
  Input,
  Text,
  BottomSheet,
  ListItem,
} from 'react-native-elements'
import styled from 'styled-components/native'

import useRecording from '../hooks/useRecording'
import useAudioTextChat from '../hooks/useAudioTextChat'
import { View } from '../components/Themed'

export default function AdventureScreen() {
  const [char, setChar] = React.useState({ name: 'Seba' })
  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const list = [
    {
      name: 'Seba',
      containerStyle: { backgroundColor: 'blue' },
      titleStyle: { color: 'white' },
      onPress: () => {
        setChar({ name: 'Seba' })
        setIsVisible(false)
      },
    },
    {
      name: 'Sujin',
      containerStyle: { backgroundColor: 'purple' },
      titleStyle: { color: 'white' },
      onPress: () => {
        setChar({ name: 'Sujin' })
        setIsVisible(false)
      },
    },
    {
      name: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ]

  const { startRecording, stopRecording, isRecording } = useRecording()
  const {
    messages,
    addAudioMessage,
    addTextMessage,
    deleteMessage,
    onPlayPausePressed,
    isPlaying,
    clearChat,
    saveChat,
    loadChat,
  } = useAudioTextChat()

  const [inputText, setInputText] = React.useState<string>('')
  const input = React.createRef<Input>()

  const onTextSubmit = () => {
    if (inputText !== '') {
      addTextMessage(inputText, char)
      // setInputText('')
    }
  }

  const stopRecordingAndAddToChat = async () => {
    const audioMsg = await stopRecording()
    addAudioMessage(audioMsg, char)
  }

  return (
    <AdventureContainer>
      <ChatArea>
        {messages.map((message, index) => {
          if (message.type === 'text') {
            return (
              <ButtonBox key={String(Math.random())}>
                <ChatText h4>{message.character.name}</ChatText>
                <ChatText h4>{message.text}</ChatText>
                <DeleteButton
                  onPress={() => {
                    deleteMessage(index)
                  }}
                  type="clear"
                  icon={<Icon name="close-circle" type="ionicon" color="red" />}
                />
              </ButtonBox>
            )
          } else {
            return (
              <ButtonBox key={String(Math.random())}>
                <ChatText h4>{message.character.name}</ChatText>
                <PlayButton
                  title={isPlaying(index) ? 'Stop Playing' : 'Play Recording'}
                  onPress={() => {
                    onPlayPausePressed(index)
                  }}
                  icon={
                    <Icon
                      name={isPlaying(index) ? 'pause-circle' : 'play-circle'}
                      type="ionicon"
                      color="white"
                    />
                  }
                />
                <DeleteButton
                  onPress={() => {
                    deleteMessage(index)
                  }}
                  type="clear"
                  icon={<Icon name="close-circle" type="ionicon" color="red" />}
                />
              </ButtonBox>
            )
          }
        })}
      </ChatArea>
      <Separator lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <InputBox>
        <InputWrapper>
          <Input
            placeholder="Enter your message..."
            onChangeText={(value) => setInputText(value)}
            onSubmitEditing={onTextSubmit}
            clearTextOnFocus
            ref={input}
          />
        </InputWrapper>
        <TextSubmitButton
          onPress={onTextSubmit}
          icon={<Icon name="enter-outline" type="ionicon" color="white" />}
        />
      </InputBox>
      <ButtonBox>
        <RecordButton
          onPress={isRecording() ? stopRecordingAndAddToChat : startRecording}
          type="clear"
          icon={
            <Icon
              name={!isRecording() ? 'mic-circle' : 'stop-circle'}
              type="ionicon"
              color={isRecording() ? 'black' : 'red'}
              size={50}
            />
          }
        />
        <ClearButton
          title="Clear"
          onPress={clearChat}
          icon={
            <Icon name="trash-outline" type="ionicon" color="white" size={30} />
          }
        />
        <ClearButton
          title="Save"
          onPress={saveChat}
          icon={
            <Icon name="arrow-down" type="ionicon" color="white" size={30} />
          }
        />
        <ClearButton
          title="Load"
          onPress={loadChat}
          icon={<Icon name="arrow-up" type="ionicon" color="white" size={30} />}
        />
        <ClearButton
          title="Load"
          onPress={() => {
            setIsVisible(true)
          }}
          icon={
            <Icon name="arrow-up" type="ionicon" color="yellow" size={30} />
          }
        />
      </ButtonBox>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        modalProps={{}}
      >
        {list.map((l, i) => (
          <ListItem
            key={Math.random()}
            containerStyle={l.containerStyle}
            onPress={l.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </AdventureContainer>
  )
}

const RecordButton = styled(Button).attrs({
  textAlign: 'right',
  containerStyle: {
    margin: 10,
  },
})``

const DeleteButton = styled(Button).attrs({
  alignSelf: 'flex-end',
})``

const ClearButton = RecordButton
const TextSubmitButton = RecordButton
const PlayButton = RecordButton

const AdventureContainer = styled(View).attrs({
  flex: 1,
  alignItems: 'center',
  padding: 20,
})``

const ChatArea = styled(ScrollView).attrs({
  flex: 1,
  width: '100%',
})``

const ChatText = styled(Text).attrs({
  h4Style: {
    marginBottom: 10,
    color: 'red',
  },
})``

const InputBox = styled(View).attrs({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  color: 'red',
})``

const InputWrapper = styled(View).attrs({
  width: 300,
})``

const ButtonBox = styled(View).attrs({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
})``

const Separator = styled(View).attrs({
  marginVertical: 30,
  height: 1,
  width: '80%',
})``
