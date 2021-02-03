/* eslint-disable no-console */
import React from 'react'
import { Platform } from 'react-native'
import { Audio, AVPlaybackStatus } from 'expo-av'
import * as FileSystem from 'expo-file-system'

import initializeAudio from '../utils/initializeAudio'

type ChatMessage = string | Audio.Sound

type AudioStatus = 'playing' | 'paused' | 'stopped'

type AudioStatusDict = {
  [key: number]: AudioStatus
}

export default function useAudioTextChat() {
  initializeAudio()

  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [audioStatus, setAudioStatus] = React.useState<AudioStatusDict>({})

  const isPlaying = (index: number) => audioStatus[index] === 'playing'

  const setAudioIndexStatus = (index: number, newStatus: AudioStatus) => {
    setAudioStatus((oldAudioStatus) => ({
      ...oldAudioStatus,
      [index]: newStatus,
    }))
  }

  const onPlaybackStatusUpdate = (index: number, audioMsg: Audio.Sound) => (
    playbackStatus: AVPlaybackStatus
  ) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.warn(
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
        // Rewind, also prevents android version from looping
        audioMsg.stopAsync()
      }
    }
  }

  const onPlayPausePressed = (index: number) => {
    const audioMsg = messages[index] as Audio.Sound

    if (isPlaying(index)) {
      audioMsg.pauseAsync()
      setAudioIndexStatus(index, 'paused')
    } else {
      audioMsg.playAsync()
      setAudioIndexStatus(index, 'playing')
    }
  }

  const addTextMessage = (msg: string) => {
    setMessages((oldMsgs) => [...oldMsgs, msg])
  }

  const addAudioMessage = (msg: Audio.Sound) => {
    const index = messages.length
    msg.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(index, msg))
    setMessages((oldMsgs) => [...oldMsgs, msg])
    setAudioIndexStatus(index, 'stopped')
  }

  const clearChat = () => {
    messages.forEach((message) => {
      if (typeof message !== 'string') {
        message.unloadAsync()
      }
    })
    setMessages([])
    setAudioStatus({})
  }

  const saveChat = async () => {
    const parsedChat = await Promise.all(
      messages.map(async (message) => {
        if (typeof message === 'string') {
          return {
            type: 'text',
            value: message,
          }
        }
        const status = await message.getStatusAsync()
        let uri: string
        if (status.isLoaded && Platform.OS === 'ios') {
          uri = status.uri
        } else if (
          status.isLoaded &&
          Platform.OS === 'android' &&
          status.uri.match(/Audio\/.*/) !== null
        ) {
          const filePath = status.uri.match(/Audio\/.*/)![0]
          uri = `${FileSystem.cacheDirectory}${filePath}`
        } else if (
          status.isLoaded &&
          Platform.OS === 'android' &&
          status.uri.match(/Audio\/.*/) === null
        ) {
          const filePath = status.uri.match(/\d*.m4a/)![0]
          uri = `${FileSystem.cacheDirectory}${filePath}`
        } else {
          throw new Error('Audio file was not loaded')
        }
        const parsedAudioFile = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        })
        return {
          type: 'audio',
          value: parsedAudioFile,
        }
      })
    )

    FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}Save`,
      JSON.stringify(parsedChat)
    )
  }

  const tempUri = (index: number) => {
    if (Platform.OS === 'ios') {
      return `${FileSystem.documentDirectory}${index}.m4a`
    }
    return `${FileSystem.cacheDirectory}${index}.m4a`
  }

  const loadChat = async () => {
    const rawChat = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory}Save`
    )
    const parsedChat: any[] = JSON.parse(rawChat)
    const mappedChat = await Promise.all(
      parsedChat.map(async (message, index) => {
        if (message.type === 'text') {
          return message.value as string
        }
        const uri = tempUri(index)
        await FileSystem.writeAsStringAsync(uri, message.value, {
          encoding: FileSystem.EncodingType.Base64,
        })
        const { sound } = await Audio.Sound.createAsync({ uri })
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(index, sound))
        return sound
      })
    )
    setMessages(mappedChat)
  }

  return {
    messages,
    setMessages,
    onPlayPausePressed,
    addTextMessage,
    addAudioMessage,
    isPlaying,
    clearChat,
    saveChat,
    loadChat,
  }
}
