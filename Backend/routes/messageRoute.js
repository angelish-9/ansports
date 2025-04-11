// routes/messageRoute.js
import express from 'express';
import Message from '../models/Message.js';

const messageRouter = express.Router();

// ✅ Get all messages (admin view)
messageRouter.get('/all', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // oldest to newest
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all messages' });
  }
});

messageRouter.get('/test', (req, res) => {
    res.send('Message route working ✅');
  });
  

export default messageRouter;
