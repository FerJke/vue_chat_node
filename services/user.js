const User = require('../models/User');

async function createUser(data) {
  try {
    const user = await User.updateOne(
      { email: data.email },
      data,
      { upsert: true }
    );
    return user;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getUserByEmail(email) {
  try {
    const user = await User.find({ email });
    return user;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getCurrentUserData(email) {
  try {
    const user = await User.find({email: email});
    return user;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function userJoinChat(chatId, userId) {
  try {
    await User.updateOne(
      { _id: userId, chats: { $nin: chatId } },
      { $push: { chats: chatId } },
    );
    return true;
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  getCurrentUserData,
  userJoinChat,
};
