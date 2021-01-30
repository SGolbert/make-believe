import * as React from 'react'
import { ScrollView } from 'react-native'
import { Icon, Button, Input, Text } from 'react-native-elements'
import styled from 'styled-components/native'

import useRecording from '../hooks/useRecording'
import useAudioTextChat from '../hooks/useAudioTextChat'
import { View } from '../components/Themed'

export default function AdventureScreen() {
  const { startRecording, stopRecording, isRecording } = useRecording()
  const {
    messages,
    addAudioMessage,
    addTextMessage,
    onPlayPausePressed,
    isPlaying,
    clearChat,
  } = useAudioTextChat()

  const [inputText, setInputText] = React.useState<string>('')
  const input = React.createRef<Input>()

  const onTextSubmit = () => {
    if (inputText !== '') {
      addTextMessage(inputText)
      // setInputText('')
    }
  }

  const stopRecordingAndAddToChat = async () => {
    const audioMsg = await stopRecording()
    addAudioMessage(audioMsg)
  }

  return (
    <AdventureContainer>
      <ChatArea>
        {messages.map((message, index) => {
          if (typeof message === 'string') {
            return (
              <ChatText h4 key={String(Math.random())}>
                {message}
              </ChatText>
            )
          } else {
            return (
              <PlayButton
                key={String(Math.random())}
                title={isPlaying(index) ? 'Stop Playing' : 'Play Recording'}
                onPress={() => {
                  onPlayPausePressed(index)
                }}
                icon={
                  <Icon
                    name={isPlaying(index) ? 'stop-circle' : 'play-circle'}
                    type="ionicon"
                    color="white"
                  />
                }
              />
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
          onPress={() => {
            clearChat()
          }}
          icon={
            <Icon name="trash-outline" type="ionicon" color="white" size={30} />
          }
        />
      </ButtonBox>
    </AdventureContainer>
  )
}

const RecordButton = styled(Button).attrs({
  textAlign: 'right',
  containerStyle: {
    margin: 10,
  },
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
