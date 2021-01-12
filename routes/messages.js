const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getChatMessages,
  createNewMessage,
} = require('../services/messages');

const router = express.Router();

// /messages/chat/:id
router.get('/chat/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await getChatMessages(id);
    res.status(200).send(messages);
  } catch (err) {
    res.status(400).send(err);
  }
});

// /messages/chat/:id
router.post('/chat/:id', authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.params;
    const newMsg = {
      chat: req.body.chat,
      user: req.body.user,
      text: req.body.text,
    };
    const message = await createNewMessage(newMsg);
    res.status(200).send(message);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
