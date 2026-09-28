import { useState } from 'react'
import type { User } from '../types/User'
import type { SnailPayResponse } from '../types/SnailPay'
import {
    saveSnailPayTransaction,
    updateUserBalance,
} from '../utils/storage'

// Data received from the authenticated user
interface AddBalanceFormProps {
    user: User
    onUserUpdate: (updatedUser: User) => void

}

function AddBalanceForm({ user, onUserUpdate }: AddBalanceFormProps) {
    // Form fields required by the simulated SnailPay service
    const [cardNumber, setCardNumber] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [fullName, setFullName] = useState('')
    const [amount, setAmount] = useState('')

    // Controls the payment result message shown to the user
    const [message, setMessage] = useState('')

    // Prevents multiple submissions while SnailPay is processing
    const [isLoading, setIsLoading] = useState(false)

    // Formats the expiration date automatically as MM/YY
    function handleExpirationDateChange(value: string) {
        // Keep only numbers and limit the input to four digits
        const digits = value.replace(/\D/g, '').slice(0, 4)

        // Add the slash automatically after the month
        if (digits.length > 2) {
            setExpirationDate(
                `${digits.slice(0, 2)}/${digits.slice(2)}`
            )
        } else {
            setExpirationDate(digits)
        }
    }

    // Sends the payment information to the simulated SnailPay API
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setMessage('')
        setIsLoading(true)

        // Cancels the request if SnailPay takes too long to respond
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
            const response = await fetch(
                'http://localhost:3000/api/snailpay/payments',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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

                const updatedUser = updateUserBalance(
                    user.id,
                    newBalance
                )

                if (updatedUser) {
                    // Update React state so the new balance appears immediately
                    onUserUpdate(updatedUser)
                }
            }

            // Display the result returned by SnailPay
            setMessage(data.status_detail)

        } catch (error) {
            // Show a specific message when the request exceeds the time limit
            if (error instanceof DOMException && error.name === 'AbortError') {
                setMessage('SnailPay request timed out')
            } else {
                console.error('SnailPay request failed:', error)
                setMessage('Unable to connect to SnailPay')
            }
        } finally {
            // Always clear the timer and restore the submit button
            clearTimeout(timeoutId)
            setIsLoading(false)
        }
    }

    return (
        <section>
            <h2>Add Balance</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="cardNumber">Card number</label>
                    <input
                        id="cardNumber"
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="expirationDate">Expiration date</label>
                    <input
                        id="expirationDate"
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        inputMode="numeric"
                        value={expirationDate}
                        onChange={(e) => handleExpirationDateChange(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="cvv">CVV</label>
                    <input
                        id="cvv"
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="fullName">Full name</label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Add balance'}
                </button>

                {message && <p>{message}</p>}

            </form>
        </section>
    )
}

export default AddBalanceForm