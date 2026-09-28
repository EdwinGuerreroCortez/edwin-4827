import express from 'express';
import snailPayRouter from './routes/snailPay.js'
import cors from 'cors'

const app = express();
const PORT = 3000;

// Allows the frontend development server to communicate with the API
app.use(cors({
    origin: 'http://localhost:5173',
}))

app.use(express.json());
// Routes for the simulated SnailPay service
app.use('/api/snailpay', snailPayRouter)

// Routes for the simulated SnailPay service
app.use('/api/snailpay', snailPayRouter)
app.get('/', (_req, res) => {
    res.json({
        message: 'API running successfully',
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});