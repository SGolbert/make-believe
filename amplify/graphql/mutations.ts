/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createChat = /* GraphQL */ `
  mutation CreateChat(
    $input: CreateChatInput!
    $condition: ModelChatConditionInput
  ) {
    createChat(input: $input, condition: $condition) {
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
export const updateChat = /* GraphQL */ `
  mutation UpdateChat(
    $input: UpdateChatInput!
    $condition: ModelChatConditionInput
  ) {
    updateChat(input: $input, condition: $condition) {
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
export const deleteChat = /* GraphQL */ `
  mutation DeleteChat(
    $input: DeleteChatInput!
    $condition: ModelChatConditionInput
  ) {
    deleteChat(input: $input, condition: $condition) {
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
export const createAudioOrTextMsg = /* GraphQL */ `
  mutation CreateAudioOrTextMsg(
    $input: CreateAudioOrTextMsgInput!
    $condition: ModelAudioOrTextMsgConditionInput
  ) {
    createAudioOrTextMsg(input: $input, condition: $condition) {
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
export const updateAudioOrTextMsg = /* GraphQL */ `
  mutation UpdateAudioOrTextMsg(
    $input: UpdateAudioOrTextMsgInput!
    $condition: ModelAudioOrTextMsgConditionInput
  ) {
    updateAudioOrTextMsg(input: $input, condition: $condition) {
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
export const deleteAudioOrTextMsg = /* GraphQL */ `
  mutation DeleteAudioOrTextMsg(
    $input: DeleteAudioOrTextMsgInput!
    $condition: ModelAudioOrTextMsgConditionInput
  ) {
    deleteAudioOrTextMsg(input: $input, condition: $condition) {
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
export const createCharacter = /* GraphQL */ `
  mutation CreateCharacter(
    $input: CreateCharacterInput!
    $condition: ModelCharacterConditionInput
  ) {
    createCharacter(input: $input, condition: $condition) {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateCharacter = /* GraphQL */ `
  mutation UpdateCharacter(
    $input: UpdateCharacterInput!
    $condition: ModelCharacterConditionInput
  ) {
    updateCharacter(input: $input, condition: $condition) {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteCharacter = /* GraphQL */ `
  mutation DeleteCharacter(
    $input: DeleteCharacterInput!
    $condition: ModelCharacterConditionInput
  ) {
    deleteCharacter(input: $input, condition: $condition) {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
