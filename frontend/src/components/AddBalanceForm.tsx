import { useState } from 'react'
import type { User } from '../types/User'
import type { SnailPayResponse } from '../types/SnailPay'

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'

import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded'

import {
    saveSnailPayTransaction,
    updateUserBalance,
} from '../utils/storage'

// Data received from the authenticated user
interface AddBalanceFormProps {
    user: User
    onUserUpdate: (updatedUser: User) => void
}

type MessageType = 'success' | 'error' | null

function AddBalanceForm({ user, onUserUpdate }: AddBalanceFormProps) {
    // Form fields required by the simulated SnailPay service
    const [cardNumber, setCardNumber] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [fullName, setFullName] = useState('')
    const [amount, setAmount] = useState('')

    // Controls the payment result shown to the user
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<MessageType>(null)

    // Prevents multiple submissions while SnailPay is processing
    const [isLoading, setIsLoading] = useState(false)

    // Formats the expiration date automatically as MM/YY
    function handleExpirationDateChange(value: string) {
        // Keep only numbers and limit the input to four digits
        const digits = value.replace(/\D/g, '').slice(0, 4)

        // Add the slash automatically after the month
        if (digits.length > 2) {
            setExpirationDate(`${digits.slice(0, 2)}/${digits.slice(2)}`)
        } else {
            setExpirationDate(digits)
        }
    }

    // Allows only numeric card values and limits them to 16 digits
    function handleCardNumberChange(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 16)
        setCardNumber(digits)
    }

    // Allows only numeric CVV values and limits them to 3 digits
    function handleCvvChange(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 3)
        setCvv(digits)
    }

    // Sends the payment information to the simulated SnailPay API
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setMessage('')
        setMessageType(null)
        setIsLoading(true)

        // Cancels the request if SnailPay takes too long to respond
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
            const response = await fetch(
                'http://localhost:3000/api/snailpay/payments',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal,
                    body: JSON.stringify({
                        cardNumber,
                        expirationDate,
                        cvv,
                        fullName,
                        amount: Number(amount),
                        payerId: user.id,
                        payerEmail: user.email,
                    }),
                }
            )

            const data: SnailPayResponse = await response.json()

            // Store the SnailPay response, including the fictitious card and CVV
            saveSnailPayTransaction(data)

            // Only approved payments are allowed to modify the user's balance
            if (data.status === 'approved') {
                const newBalance = user.balance + data.transaction_amount

                const updatedUser = updateUserBalance(user.id, newBalance)

                if (updatedUser) {
                    // Update React state so the balance changes immediately
                    onUserUpdate(updatedUser)
                }

                setMessageType('success')
            } else {
                setMessageType('error')
            }

            // Display the result returned by SnailPay
            setMessage(data.status_detail)
        } catch (error) {
            setMessageType('error')

            // Show a specific message when the request exceeds the time limit
            if (error instanceof DOMException && error.name === 'AbortError') {
                setMessage('SnailPay request timed out.')
            } else {
                console.error('SnailPay request failed:', error)
                setMessage('Unable to connect to SnailPay.')
            }
        } finally {
            // Always clear the timer and restore the submit button
            clearTimeout(timeoutId)
            setIsLoading(false)
        }
    }

    return (
        <Card
            sx={{
                maxWidth: 640,
                mx: 'auto',
            }}
        >
            <CardContent>
                {/* Form header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 0.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        aria-hidden="true"
                    >
                        <AddCardRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Payment Details
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enter fictitious card details to recharge your balance via SnailPay.
                </Typography>

                <Divider sx={{ mb: 3, borderColor: '#E4EDE7' }} />

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: 'grid', gap: 2.5 }}
                >
                    {/* Card number */}
                    <TextField
                        id="snailpay-cardNumber"
                        label="Card Number"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        required
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                inputMode: 'numeric',
                                maxLength: 16,
                                'aria-label': 'Card number (16 digits)',
                            },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCardRoundedIcon
                                            sx={{ color: 'text.secondary', fontSize: 20 }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* Expiration date and CVV side by side */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            id="snailpay-expirationDate"
                            label="Expiration Date"
                            placeholder="MM/YY"
                            value={expirationDate}
                            onChange={(e) =>
                                handleExpirationDateChange(e.target.value)
                            }
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    inputMode: 'numeric',
                                    maxLength: 5,
                                    'aria-label': 'Expiration date in MM/YY format',
                                },
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthRoundedIcon
                                                sx={{ color: 'text.secondary', fontSize: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <TextField
                            id="snailpay-cvv"
                            label="CVV"
                            value={cvv}
                            onChange={(e) => handleCvvChange(e.target.value)}
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    inputMode: 'numeric',
                                    maxLength: 3,
                                    'aria-label': 'CVV (3 digits)',
                                },
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockRoundedIcon
                                                sx={{ color: 'text.secondary', fontSize: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>

                    {/* Card holder full name */}
                    <TextField
                        id="snailpay-fullName"
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonRoundedIcon
                                            sx={{ color: 'text.secondary', fontSize: 20 }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* Recharge amount */}
                    <TextField
                        id="snailpay-amount"
                        label="Recharge Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        fullWidth
                        slotProps={{
                            htmlInput: { min: 0.01, step: 0.01 },
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyRoundedIcon
                                            sx={{ color: 'text.secondary', fontSize: 20 }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* SnailPay response feedback */}
                    {message && messageType && (
                        <Alert severity={messageType} role="alert">
                            {message}
                        </Alert>
                    )}

                    <Button
                        id="snailpay-submit"
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <AddCardRoundedIcon />
                            )
                        }
                        sx={{ mt: 0.5, py: 1.4 }}
                    >
                        {isLoading ? 'Processing…' : 'Add Balance'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}

export default AddBalanceForm