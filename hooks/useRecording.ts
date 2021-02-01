import React from 'react'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'

import initializeAudio from '../utils/initializeAudio'

export default function useRecording() {
  initializeAudio()

  const [recording, setRecording] = React.useState<Audio.Recording>()

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const micRecording = new Audio.Recording()
      await micRecording.prepareToRecordAsync({
        ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 96400,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      })
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
      const uri = recording.getURI()
      console.log('Recording to be found at:', uri)
      const fileAsString = await FileSystem.readAsStringAsync(uri as string, {
        encoding: FileSystem.EncodingType.Base64,
      })
      console.log(
        'Parsed audio file',
        fileAsString.length,
        FileSystem.documentDirectory
      )
      const mySound = (await recording.createNewLoadedSoundAsync()).sound
      return mySound
    } catch (error) {
      throw new Error('Failed to unload recording')
    } finally {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      })
    }
  }

  const isRecording = () => recording !== undefined

  return {
    startRecording,
    stopRecording,
    isRecording,
  }
}
