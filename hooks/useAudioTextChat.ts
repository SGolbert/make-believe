/* eslint-disable no-console */
import React from 'react'
import { Audio, AVPlaybackStatus } from 'expo-av'

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
        // Rewind
        audioMsg.setPositionAsync(0)
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
    setMessages([])
    setAudioStatus({})
  }

  return {
    messages,
    setMessages,
    onPlayPausePressed,
    addTextMessage,
    addAudioMessage,
    isPlaying,
    clearChat,
  }
}
