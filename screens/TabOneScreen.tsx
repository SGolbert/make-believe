import * as React from 'react'
import { Button, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { Audio } from 'expo-av'

import EditScreenInfo from '../components/EditScreenInfo'
import { Text, View } from '../components/Themed'

export default function TabOneScreen() {
  const [sound, setSound] = React.useState<Audio.Sound>()

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

  const [recording, setRecording] = React.useState<Audio.Recording>()

  const [playing, setPlaying] = React.useState<boolean>(false)

  const onPlayPausePressed = () => {
    if (sound === undefined) {
      return
    }

    if (playing) {
      sound.stopAsync()
      setPlaying(false)
    } else {
      sound.playAsync()
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
    setSound(mySound)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Icon
        reverse
        name="ios-american-football"
        type="ionicon"
        color="#517fa4"
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
        title={playing ? 'Stop Playing' : 'Play Recording'}
        onPress={onPlayPausePressed}
      />
      <Button title="Play Sound" onPress={playSound} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
})
