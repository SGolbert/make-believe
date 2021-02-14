/* tslint:disable */
/* eslint-disable */

export const getChat = /* GraphQL */ `
  query GetChat($id: ID!) {
    getChat(id: $id) {
      messages {
        items {
          id
          type
          value
          createdAt
          character {
            id
            name
          }
        }
        nextToken
      }
    }
  }
`

export const listCharacters = /* GraphQL */ `
  query ListCharacters(
    $filter: ModelCharacterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCharacters(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
      }
      nextToken
    }
  }
`
