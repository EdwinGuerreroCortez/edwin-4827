import express from 'express'
import cors from 'cors'
import snailPayRouter from './routes/snailPay.js'

const app = express()

// Allows the frontend development server to communicate with the API
app.use(cors({
    origin: 'http://localhost:5173',
}))

// Allows the API to receive JSON request bodies
app.use(express.json())

// SnailPay simulated service routes
app.use('/api/snailpay', snailPayRouter)

export default app