const Message = require('../models/Message');

/**
 * 
 * @param {String} chatId 
 */
async function getChatMessages(chatId) {
  try {
    const messages = await Message.find({ chat: chatId })
      .populate('user', ['firstName', 'lastName']);
    
    return messages;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * 
 * @param {Object} message
 */
async function createNewMessage({ chat, user, text }) {
  try {
    const newMessage = {
      chat,
      user,
      text,
      time: Date.now(),
    };
    const message = await Message.create(newMessage);
    const createdMsg = await Message.findById(message._id)
      .populate('user', ['firstName', 'lastName']);
    return createdMsg;
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  getChatMessages,
  createNewMessage,
};
