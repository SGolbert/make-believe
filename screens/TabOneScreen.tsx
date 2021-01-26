import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Icon, Button, Input, Text } from 'react-native-elements'
import { Audio } from 'expo-av'

import { View } from '../components/Themed'

type ChatMessage = string | Audio.Sound

export default function TabOneScreen() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [inputText, setInputText] = React.useState<string>('')
  const [sound, setSound] = React.useState<Audio.Sound>()
  const [recording, setRecording] = React.useState<Audio.Recording>()
  const [playing, setPlaying] = React.useState<boolean>(false)

  async function playSound() {
    console.log('Loading Sound')
    const { sound: sample } = await Audio.Sound.createAsync(
      require('../assets/sample.mp3')
    )
    setSound(sample)

    console.log('Playing Sound')
    await sample.playAsync()
  }

  React.useEffect(
    () =>
      sound !== undefined
        ? () => {
            console.log('Unloading Sound')
            sound.unloadAsync()
            setPlaying(false)
          }
        : undefined,
    [sound]
  )

  const onPlayPausePressed = (index: number) => {
    const audioMsg = messages[index] as Audio.Sound

    if (playing) {
      audioMsg.stopAsync()
      setPlaying(false)
    } else {
      audioMsg.playAsync()
      setPlaying(true)
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
    setMessages((chatMsgs) => [...chatMsgs, mySound])
  }

  const input = React.createRef<Input>()

  const onTextSubmit = () => {
    if (inputText !== '') {
      setMessages((currentMsg) => [...currentMsg, inputText])
      // setInputText('')
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
          }
          return (
            <Button
              title={playing ? 'Stop Playing' : 'Play Recording'}
              onPress={() => {
                onPlayPausePressed(index)
              }}
              containerStyle={styles.button}
              icon={
                <Icon
                  name={playing ? 'stop-circle' : 'play-circle'}
                  type="ionicon"
                  color="white"
                />
              }
            />
          )
        })}
      </ScrollView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <View style={styles.buttonBox}>
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
          containerStyle={styles.button}
          icon={
            <Icon
              name={!recording ? 'mic-circle' : 'stop-circle'}
              type="ionicon"
              color="white"
            />
          }
        />
        <Button
          title={playing ? 'Stop Playing' : 'Play Recording'}
          onPress={onPlayPausePressed}
          containerStyle={styles.button}
          icon={
            <Icon
              name={playing ? 'stop-circle' : 'play-circle'}
              type="ionicon"
              color="white"
            />
          }
        />
      </View> */}
      <View style={styles.inputBox}>
        <Input
          placeholder="Enter your message..."
          onChangeText={(value) => setInputText(value)}
          inputContainerStyle={styles.input}
          onSubmitEditing={onTextSubmit}
          clearTextOnFocus
          ref={input}
        />
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
  },
  button2: {
    backgroundColor: 'white',
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    // borderWidth: 2,
    // borderColor: 'black',
    marginRight: 5,
    // width: 200,
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
