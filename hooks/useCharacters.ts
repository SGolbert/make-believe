import React from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'

import {
  // createCharacter,
  createAudioOrTextMsg,
  // createChat,
  deleteAudioOrTextMsg,
} from '../amplify/graphql/mutations'
import { listCharacters } from '../amplify/graphql/customQueries'
// @ts-ignore: Import from JS file
import awsconfig from '../amplify/aws-exports'

Amplify.configure(awsconfig)

export type Character = {
  id: string
  name: string
}

export default function useCharacters(chatId: string) {
  const [chars, setChars] = React.useState<Character[]>([])

  React.useEffect(() => {
    const loadDynamo = async () => {
      const resp = await API.graphql(
        graphqlOperation(listCharacters, {
          filter: { chatID: { eq: 'ec5b841d-1e60-42ef-9df7-8d2440127e60' } },
        })
      )

      const result: any[] = resp.data.listCharacters.items

      setChars(result)
    }

    loadDynamo()
  }, [])

  return {
    chars,
    setChars,
  }
}
