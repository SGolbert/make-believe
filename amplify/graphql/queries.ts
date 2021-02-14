/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getChat = /* GraphQL */ `
  query GetChat($id: ID!) {
    getChat(id: $id) {
      id
      messages {
        items {
          id
          chatID
          type
          value
          createdAt
          updatedAt
        }
        nextToken
      }
      characters {
        items {
          id
          chatID
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listChats = /* GraphQL */ `
  query ListChats(
    $filter: ModelChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        messages {
          nextToken
        }
        characters {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAudioOrTextMsg = /* GraphQL */ `
  query GetAudioOrTextMsg($id: ID!) {
    getAudioOrTextMsg(id: $id) {
      id
      chatID
      type
      value
      character {
        id
        chatID
        name
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAudioOrTextMsgs = /* GraphQL */ `
  query ListAudioOrTextMsgs(
    $filter: ModelAudioOrTextMsgFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAudioOrTextMsgs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatID
        type
        value
        character {
          id
          chatID
          name
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCharacter = /* GraphQL */ `
  query GetCharacter($id: ID!) {
    getCharacter(id: $id) {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
export const listCharacters = /* GraphQL */ `
  query ListCharacters(
    $filter: ModelCharacterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCharacters(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chatID
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
