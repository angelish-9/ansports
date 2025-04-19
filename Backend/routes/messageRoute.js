import express from 'express';
import Message from '../models/Message.js';

const messageRouter = express.Router();


messageRouter.get('/:senderId/:receiverId', async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

messageRouter.get('/users', async (req, res) => {
  const adminId = process.env.ADMIN_ID;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: adminId },
        { receiverId: adminId },
      ],
    })
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email');

    const usersMap = new Map();

    messages.forEach((msg) => {
      const sender = msg.senderId;
      const receiver = msg.receiverId;

      if (sender._id.toString() !== adminId) {
        usersMap.set(sender._id.toString(), sender);
      }
      if (receiver._id.toString() !== adminId) {
        usersMap.set(receiver._id.toString(), receiver);
      }
    });

    res.json(Array.from(usersMap.values()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unique users' });
  }
});



export default messageRouter;
