const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});
const { url } = require('./config/mongo-db');
const {
  GLOBAL_CHAT_NAME,
  ROUTES,
} = require('./constants');
const SocketListeners = require('./socket/listeners');
const SocketEmitters = require('./socket/emitters');

// Services
const chatsServices = require('./services/chats');
const userServices = require('./services/user');
const messageServices = require('./services/messages');

// Routes
const userRoutes = require('./routes/user');
const chatsRoutes = require('./routes/chats');
const messagesRoutes = require('./routes/messages');

// Init App
async function initApp() {
  try {
    const globalChat = await chatsServices.isGlobalChatExists();
    if (globalChat) return Promise.resolve();

    await chatsServices.createChat({ name: GLOBAL_CHAT_NAME });
  } catch (err) {
    return Promise.reject(err);
  }
}

app.use(cors());
app.use(express.json());

// Connect to DB
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {console.log('DB connection success')})
  .then(initApp())
  .then(() => {console.log('Chat created');})
  .catch((err) => {console.log('Error: ', err)});

app.use(ROUTES.user, userRoutes);
app.use(ROUTES.chats, chatsRoutes);
app.use(ROUTES.messages, messagesRoutes);

io.on('connection', (socket) => {
  console.log('user connected');
  // Join Chat
  socket.on(SocketListeners.JOIN_CHAT, async ({ chatId, userId, userFullName }) => {
    // emit
    try {
      await  userServices.userJoinChat(chatId, userId);
      socket.join(chatId);
      io.in(chatId).emit(
        SocketEmitters.NEW_USER_JOIN,
        {
          userName: userFullName,
          userId,
        }
      );
    } catch (err) {
      console.log(err);
    }
  });

  // Select Chat
  socket.on(SocketListeners.SELECT_CHAT, ({ chatId }) => {
    console.log(SocketListeners.SELECT_CHAT);
    // emit
    socket.join(chatId);
  });

  // User Typing
  socket.on(SocketListeners.USER_TYPING, ({ chatId, userId }) => {
    // emit
    io.emit(SocketEmitters.USER_TYPING, { chatId, userId });
  });

  // New Message
  socket.on(SocketListeners.NEW_MESSAGE, async ({ chat, user, text }) => {
    console.log(SocketListeners.NEW_MESSAGE);
    // seve message to db
    try {
      const message = await messageServices.createNewMessage({ chat, user, text });
      await chatsServices.setLastMessage(chat, message._id);
      // emit
      io.in(chat).emit(SocketEmitters.NEW_MESSAGE, message);
    } catch (err) {
      console.log(err);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`App listernin at http://localhost:${PORT}`);
});
