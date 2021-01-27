import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Icon, Button, Input, Text } from 'react-native-elements'
import { Audio, AVPlaybackStatus } from 'expo-av'

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
    <View style={styles.container}>
      <ScrollView style={styles.chatArea}>
        {messages.map((message, index) => {
          if (typeof message === 'string') {
            return (
              <Text h4 style={styles.chat} key={String(Math.random())}>
                {message}
              </Text>
            )
          } else {
            return (
              <Button
                key={String(Math.random())}
                title={isPlaying(index) ? 'Stop Playing' : 'Play Recording'}
                onPress={() => {
                  onPlayPausePressed(index)
                }}
                containerStyle={styles.button}
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
      </ScrollView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.inputBox}>
        <View style={styles.input}>
          <Input
            placeholder="Enter your message..."
            onChangeText={(value) => setInputText(value)}
            // inputContainerStyle={styles.input}
            onSubmitEditing={onTextSubmit}
            clearTextOnFocus
            ref={input}
          />
          {/* <Text>TEST</Text> */}
        </View>
        <Button
          onPress={onTextSubmit}
          containerStyle={styles.button}
          icon={<Icon name="enter-outline" type="ionicon" color="white" />}
        />
      </View>
      <View style={styles.buttonBox}>
        <Button
          onPress={recording ? stopRecording : startRecording}
          containerStyle={styles.button}
          buttonStyle={styles.button2}
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
        <Button
          title="Clear"
          onPress={() => {
            setMessages([])
            setAudioStatus({})
          }}
          containerStyle={styles.button}
          icon={
            <Icon name="trash-outline" type="ionicon" color="white" size={30} />
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chat: {
    marginBottom: 10,
    color: 'red',
  },
  button2: {
    // backgroundColor: 'white',
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    color: 'red',
  },
  input: {
    // borderWidth: 2,
    // borderColor: 'black',
    width: 300,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    margin: 10,
  },
  chatArea: {
    flex: 1,
    width: '100%',
  },
})
