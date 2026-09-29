import express from 'express'
import cors from 'cors'
import snailPayRouter from './routes/snailPay.js'

const app = express()

// Frontend URLs allowed to communicate with the API
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin))

app.use(cors({
    origin: allowedOrigins,
}))

// Allows the API to receive JSON request bodies
app.use(express.json())

// SnailPay simulated service routes
app.use('/api/snailpay', snailPayRouter)

export default app