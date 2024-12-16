const express = require('express')
const openai = require("openai")
const cors = require('cors')

require('dotenv').config()

const client = new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // For parsing JSON request bodies
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const chatCompletion = async (messages) => {
    // API endpoint
    const url = 'http://34.49.128.94:8080/api/chat/completions'

    // Request configuration
    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEzZGIyMjE2LTUzNGEtNDZjNS1hYmRhLWE1MDNjODVhZjE3YiJ9.wORAIGflw3nsOdMzayyqPStQ4EhA3JfaHsAD_wDCR6U',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3.2:1b',
            messages: messages
        })
    }

    try {
        // Send the request
        const response = await fetch(url, options)

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Parse and return the response
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error making chat completion request:', error)
        throw error
    }
}

// Endpoint for handling chatbot requests
app.post('/api/chat', async (req, res) => {
    const messages = req.body.messages
    try {
        const response = await chatCompletion(messages)

        // Send the response from OpenAI back to the client
        res.json({ message: response.choices[0].message.content })
    } catch (error) {
        res.status(500).json({ error: 'Error fetching response from OpenAI' })
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`)
})
