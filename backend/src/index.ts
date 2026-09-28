import app from './app.js'

const PORT = 3000

// Starts the API server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
})