import React from 'react'
import { Audio } from 'expo-av'

export default function useRecording() {
  const [recording, setRecording] = React.useState<Audio.Recording>()

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const micRecording = new Audio.Recording()
      await micRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      await micRecording.startAsync()
      setRecording(micRecording)
    } catch (err) {
      throw new Error('useRecording: Failed to start recording')
    }
  }

  async function stopRecording() {
    if (recording === undefined) {
      throw new Error('useRecording: Tried to stop an non existing recording')
    }

    setRecording(undefined)
    try {
      await recording.stopAndUnloadAsync()
      const mySound = (await recording.createNewLoadedSoundAsync()).sound
      return mySound
    } catch (error) {
      throw new Error('Failed to unload recording')
    }
  }

  const isRecording = () => recording !== undefined

  return {
    startRecording,
    stopRecording,
    isRecording,
  }
}
