import { Audio } from 'expo-av'

let initialized = false

// Note: it may be called multiple times in parallel if several hooks
// which use audio are used by the same component. That's fine, as it
// is always initialized with constant values
export default async () => {
  if (initialized) {
    return
  }

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: false,
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  })

  initialized = true
}
