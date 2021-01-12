const Chat = require('../models/Chat');
const { GLOBAL_CHAT_NAME, PUBLIC_CHAT } = require('../constants');

async function isGlobalChatExists() {
  try {
    const chat = await Chat.findOne({ name: GLOBAL_CHAT_NAME });
    return chat;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function createChat(data) {
  try {
    const chat = await Chat.create(data);
    return chat;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getChat(id) {
  try {
    const chat = await Chat.findById(id);
    return chat;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getPublicChats() {
  try {
    const chats = await Chat.find({ type: PUBLIC_CHAT })
      .populate('lastMessage')
    return chats;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function setLastMessage(chatId, messageId) {
  try {
    await Chat.findByIdAndUpdate(chatId, { lastMessage: messageId }, {useFindAndModify: false});
    return true;
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  isGlobalChatExists,
  createChat,
  getPublicChats,
  getChat,
  setLastMessage,
};
