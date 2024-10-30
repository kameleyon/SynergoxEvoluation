import express from 'express';
import axios from 'axios';

const router = express.Router();

// Route for sending user messages to Botpress
router.post('/api/botpress/message', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/v1/bots/${req.body.botName}/converse`, {
      text: req.body.message,
      userId: req.body.userId
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error communicating with Botpress:', error);
    res.status(500).send('Error communicating with Botpress');
  }
});

export default router;
