const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createUser,
  getUserByEmail,
  getCurrentUserData,
} = require('../services/user');

const router = express.Router();

// /user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await getCurrentUserData(req.locals.email);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send('User data not found');
  }
});

router.get('/:email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send('User not found');
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newUser = {
      email: req.locals.email,
      ...req.body,
    };
    const user = await createUser(newUser);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Create error: ${err}`);
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const newUser = {
      email: req.locals.email,
      ...req.body,
    };
    const user = await createUser(newUser);
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(`Update error: ${err}`);
  }
});

module.exports = router;
