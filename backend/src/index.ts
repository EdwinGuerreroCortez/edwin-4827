import app from './app.js'

const PORT = process.env.PORT || 3000

// Starts the API server using the hosting port or the local development port
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`)
})