const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// I was trying to use claude API but it seems you have to pay for that
// Found this free model https://console.groq.com/docs/api-reference#chat

// CHat post route, get req and return LLM res
app.post('/api/chat', async (req, res) => {
  try {

    const messages = req.body.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(`${process.env.GROQ_API_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // According to docs this is free mmodel
        messages: messages,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    res.json({
      content: [{
        text: data.choices[0].message.content
      }]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// port listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on local port: ${PORT}`);
});