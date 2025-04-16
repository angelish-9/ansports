import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';

import Message from './models/Message.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import messageRouter from './routes/messageRoute.js';
import rentalRouter from './routes/rentalRoute.js';


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Static folder (if needed)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};


// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/message', messageRouter);
app.use('/api/rental', rentalRouter);



// Fetch chat messages between two users
app.get('/api/messages/:userId/:adminId', async (req, res) => {
  const { userId, adminId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: adminId },
        { senderId: adminId, receiverId: userId }
      ]
    }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room ${userId}`);
  });

  socket.on('private-message', async (data) => {
    const { senderId, receiverId, message } = data;
    try {
      const newMsg = await Message.create({ senderId, receiverId, message });
      io.to(receiverId).emit('receive-message', newMsg);
    } catch (err) {
      console.error('❌ Failed to save message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// Start the app only after DB is connected
const PORT = process.env.PORT || 5000;
(async () => {
  await connectToDb();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
