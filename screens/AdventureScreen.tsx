/* eslint-disable no-console */
import * as React from 'react'
import { ScrollView } from 'react-native'
import { Icon, Button, Input, Text } from 'react-native-elements'
import { Audio, AVPlaybackStatus } from 'expo-av'
import styled from 'styled-components/native'

import { View } from '../components/Themed'

type ChatMessage = string | Audio.Sound

type AudioStatus = 'playing' | 'paused' | 'stopped'

type AudioStatusDict = {
  [key: number]: AudioStatus
}

export default function TabOneScreen() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [audioStatus, setAudioStatus] = React.useState<AudioStatusDict>({})
  const [inputText, setInputText] = React.useState<string>('')
  const [recording, setRecording] = React.useState<Audio.Recording>()

  const isPlaying = (index: number) => audioStatus[index] === 'playing'
  const setAudioIndexStatus = (index: number, newStatus: AudioStatus) => {
    setAudioStatus((oldAudioStatus) => ({
      ...oldAudioStatus,
      [index]: newStatus,
    }))
  }

  const onPlayPausePressed = (index: number) => {
    console.log(audioStatus)
    const audioMsg = messages[index] as Audio.Sound

    if (isPlaying(index)) {
      audioMsg.stopAsync()
      setAudioIndexStatus(index, 'stopped')
    } else {
      audioMsg.replayAsync()
      setAudioIndexStatus(index, 'playing')
    }
  }

  async function startRecording() {
    try {
      console.log('Requesting permissions..')
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      console.log('Starting recording..')
      const micRecording = new Audio.Recording()
      await micRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      await micRecording.startAsync()
      setRecording(micRecording)
      console.log('Recording started')
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    if (recording === undefined) {
      return
    }

    console.log('Stopping recording..')
    setRecording(undefined)
    await recording.stopAndUnloadAsync()
    const uri = recording.getURI()
    console.log('Recording stopped and stored at', uri)
    const mySound = (await recording?.createNewLoadedSoundAsync()).sound
    mySound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(messages.length))
    setMessages((chatMsgs) => [...chatMsgs, mySound])
  }

  const input = React.createRef<Input>()

  const onTextSubmit = () => {
    if (inputText !== '') {
      setMessages((currentMsg) => [...currentMsg, inputText])
      // setInputText('')
    }
  }

  const onPlaybackStatusUpdate = (index: number) => (
    playbackStatus: AVPlaybackStatus
  ) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        )
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state

      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
      } else {
        // Update your UI for the paused state
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
        setAudioIndexStatus(index, 'stopped')
      }
    }
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
          onPress={recording ? stopRecording : startRecording}
          type="clear"
          icon={
            <Icon
              name={!recording ? 'mic-circle' : 'stop-circle'}
              type="ionicon"
              color={recording ? 'black' : 'red'}
              size={50}
            />
          }
        />
        <ClearButton
          title="Clear"
          onPress={() => {
            setMessages([])
            setAudioStatus({})
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
