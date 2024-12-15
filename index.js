const express = require('express');
const openai = require("openai");
const cors = require('cors');

require('dotenv').config();

const client = new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint for handling chatbot requests
app.post('/api/chat', async (req, res) => {
    const messages = req.body.messages;
    try {
        const response = await client.chat.completions.create({
            messages: messages,
            model: "gpt-4o-mini",
        });

        // Send the response from OpenAI back to the client
        res.json({ message: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
