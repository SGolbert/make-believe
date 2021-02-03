/* eslint-disable no-console */
import React from 'react'
import { Platform } from 'react-native'
import { Audio, AVPlaybackStatus } from 'expo-av'
import * as FileSystem from 'expo-file-system'

import initializeAudio from '../utils/initializeAudio'

type TextMsg = { type: 'text'; text: string }
type AudioMsg = { type: 'audio'; sound: Audio.Sound }

type ChatMessage = TextMsg | AudioMsg

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
    const msg = messages[index]
    if (msg.type !== 'audio') {
      throw new Error('onPlayPausePressed: tried to play a non-audio message')
    }
    const audioMsg = msg.sound

    if (isPlaying(index)) {
      audioMsg.pauseAsync()
      setAudioIndexStatus(index, 'paused')
    } else {
      audioMsg.playAsync()
      setAudioIndexStatus(index, 'playing')
    }
  }

  const addTextMessage = (msg: string) => {
    setMessages((oldMsgs) => [...oldMsgs, { type: 'text', text: msg }])
  }

  const addAudioMessage = (msg: Audio.Sound) => {
    const index = messages.length
    msg.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(index, msg))
    setMessages((oldMsgs) => [...oldMsgs, { type: 'audio', sound: msg }])
    setAudioIndexStatus(index, 'stopped')
  }

  const deleteMessage = (index: number) => {
    const msg = messages[index]
    if (msg.type === 'audio') {
      msg.sound.unloadAsync()
    }
    setMessages((arr) => arr.slice(0, index).concat(arr.slice(index + 1)))
  }

  const clearChat = () => {
    messages.forEach((message) => {
      if (message.type === 'audio') {
        message.sound.unloadAsync()
      }
    })
    setMessages([])
    setAudioStatus({})
  }

  const saveChat = async () => {
    const parsedChat = await Promise.all(
      messages.map(async (message) => {
        if (message.type === 'text') {
          return message
        }
        const status = await message.sound.getStatusAsync()
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
          parsedSound: parsedAudioFile,
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
          return message
        }
        const uri = tempUri(index)
        await FileSystem.writeAsStringAsync(uri, message.parsedSound, {
          encoding: FileSystem.EncodingType.Base64,
        })
        const { sound } = await Audio.Sound.createAsync({ uri })
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(index, sound))
        return { type: 'audio', sound }
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
    deleteMessage,
    isPlaying,
    clearChat,
    saveChat,
    loadChat,
  }
}
