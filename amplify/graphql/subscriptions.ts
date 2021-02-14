/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateChat = /* GraphQL */ `
  subscription OnCreateChat {
    onCreateChat {
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
export const onUpdateChat = /* GraphQL */ `
  subscription OnUpdateChat {
    onUpdateChat {
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
export const onDeleteChat = /* GraphQL */ `
  subscription OnDeleteChat {
    onDeleteChat {
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
export const onCreateAudioOrTextMsg = /* GraphQL */ `
  subscription OnCreateAudioOrTextMsg {
    onCreateAudioOrTextMsg {
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
export const onUpdateAudioOrTextMsg = /* GraphQL */ `
  subscription OnUpdateAudioOrTextMsg {
    onUpdateAudioOrTextMsg {
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
export const onDeleteAudioOrTextMsg = /* GraphQL */ `
  subscription OnDeleteAudioOrTextMsg {
    onDeleteAudioOrTextMsg {
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
export const onCreateCharacter = /* GraphQL */ `
  subscription OnCreateCharacter {
    onCreateCharacter {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCharacter = /* GraphQL */ `
  subscription OnUpdateCharacter {
    onUpdateCharacter {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCharacter = /* GraphQL */ `
  subscription OnDeleteCharacter {
    onDeleteCharacter {
      id
      chatID
      name
      createdAt
      updatedAt
    }
  }
`;
