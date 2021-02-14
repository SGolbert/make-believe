/* eslint-disable no-console */
import React from 'react'
import { Platform } from 'react-native'
import { Audio, AVPlaybackStatus } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import initializeAudio from '../utils/initializeAudio'
import {
  // createCharacter,
  createAudioOrTextMsg,
  // createChat,
  deleteAudioOrTextMsg,
} from '../amplify/graphql/mutations'
import { getChat } from '../amplify/graphql/customQueries'
// @ts-ignore: Import from JS file
import awsconfig from '../amplify/aws-exports'
import { Character } from './useCharacters'

Amplify.configure(awsconfig)

type AudioStatus = 'playing' | 'paused' | 'stopped'

type TextMsg = { id: string; type: 'text'; text: string; character: Character }
type AudioMsg = {
  type: 'audio'
  sound: Audio.Sound
  status: AudioStatus
  character: Character
}

type ChatMessage = TextMsg | AudioMsg

export default function useAudioTextChat(chatId: string) {
  initializeAudio()

  const [messages, setMessages] = React.useState<ChatMessage[]>([])

  const isPlaying = (index: number) => {
    const msg = messages[index]
    if (msg.type !== 'audio') {
      throw new Error('isPlaying: asked status of non-audio message.')
    }
    return msg.status === 'playing'
  }

  const setAudioIndexStatus = (index: number, newStatus: AudioStatus) => {
    const msg = messages[index]
    if (msg.type !== 'audio') {
      throw new Error('setAudioIndexStatus: set status of non-audio message.')
    }
    msg.status = newStatus
    setMessages((oldMsgs) => {
      const newMsgs = [...oldMsgs]
      newMsgs[index] = msg
      return newMsgs
    })
  }

  const onPlaybackStatusUpdate = (audioMsg: AudioMsg) => (
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
        // eslint-disable-next-line no-param-reassign
        audioMsg.status = 'stopped'

        // Rewind, also prevents android version from looping
        audioMsg.sound.stopAsync()
        // Trigger a re-render
        setMessages((msgs) => [...msgs])
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

  const addTextMessage = async (
    msg: string,
    character: Character,
    id?: string
  ) => {
    let newId: string
    if (id === undefined) {
      const resp = await API.graphql(
        graphqlOperation(createAudioOrTextMsg, {
          input: {
            chatID: chatId,
            audioOrTextMsgCharacterId: character.id,
            type: 'text',
            value: msg,
          },
        })
      )
      newId = resp.data.createAudioOrTextMsg.id
    }

    console.log('NEWID', newId)

    setMessages((oldMsgs) => [
      ...oldMsgs,
      { type: 'text', text: msg, character, id: id ?? newId },
    ])
  }

  const addAudioMessage = (msg: Audio.Sound, character: Character) => {
    const audioMsg: AudioMsg = {
      type: 'audio',
      sound: msg,
      status: 'stopped',
      character,
    }
    msg.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(audioMsg))
    setMessages((oldMsgs) => [...oldMsgs, audioMsg])
  }

  const deleteMessage = (index: number) => {
    const msg = messages[index]
    if (msg.type === 'audio') {
      msg.sound.unloadAsync()
    }

    if (msg.type === 'text') {
      API.graphql(
        graphqlOperation(deleteAudioOrTextMsg, {
          input: {
            id: msg.id,
          },
        })
      )
    }

    setMessages((arr) => arr.slice(0, index).concat(arr.slice(index + 1)))
  }

  const clearChat = async () => {
    await Promise.all(
      messages.map(async (message) => {
        if (message.type === 'audio') {
          await message.sound.unloadAsync()
        }
      })
    )
    setMessages([])
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
          character: message.character,
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
    await clearChat()
    const rawChat = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory}Save`
    )
    const parsedChat: any[] = JSON.parse(rawChat)

    const mappedChat = await Promise.all(
      parsedChat.map(async (message, index) => {
        if (message.type === 'text') {
          return message as TextMsg
        }
        const uri = tempUri(index)
        await FileSystem.writeAsStringAsync(uri, message.parsedSound, {
          encoding: FileSystem.EncodingType.Base64,
        })
        const { sound } = await Audio.Sound.createAsync({ uri })
        const audioMsg: AudioMsg = {
          type: 'audio',
          sound,
          status: 'stopped',
          character: message.character,
        }
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate(audioMsg))
        return audioMsg
      })
    )
    setMessages(mappedChat)
  }

  React.useEffect(() => {
    const loadDynamo = async () => {
      await clearChat()
      const resp = await API.graphql(
        graphqlOperation(getChat, {
          id: chatId,
        })
      )
      const messages: any[] = resp.data.getChat.messages.items
      const sortedMsgs = messages.sort((msg1, msg2) =>
        msg1.createdAt > msg2.createdAt ? 1 : -1
      )
      sortedMsgs.forEach((msg) => {
        addTextMessage(msg.value, msg.character, msg.id)
      })
    }

    loadDynamo()
  }, [])

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
