const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getPublicChats, getChat } = require('../services/chats');

const router = express.Router();

// /chats/public
router.get('/public', authMiddleware, async (req, res) => {
  try {
    const chats = await getPublicChats();
    res.status(200).send(chats);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// /chats/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await getChat(id);
    res.status(200).send(chat);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
