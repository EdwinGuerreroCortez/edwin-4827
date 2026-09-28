import { Router } from 'express'

interface SnailPayRequest {
    cardNumber: string
    expirationDate: string
    cvv: string
    fullName: string
    amount: number
    payerId: string
    payerEmail: string
}

const router = Router()

// Creates a consistent response for transaction errors
function createRejectedResponse(
    statusDetail: string,
    amount: number,
    payerId: string,
    payerEmail: string,
    cardNumber: string,
    cvv: string
) {
    return {
        id: crypto.randomUUID(),
        status: 'rejected',
        status_detail: statusDetail,
        transaction_amount: amount,
        date_created: new Date().toISOString(),
        authorization_code: null,
        reference: `SNAIL-${Date.now()}`,
        payer_id: payerId,
        payer_email: payerEmail,
        card_number: cardNumber,
        cvv: cvv,
    }
}

// Simulated SnailPay payment endpoint
router.post('/payments', (req, res) => {
    const {
        cardNumber,
        expirationDate,
        cvv,
        fullName,
        amount,
        payerId,
        payerEmail,
    } = req.body as SnailPayRequest

    // Validate basic payment information
    if (
        !fullName?.trim() ||
        typeof amount !== 'number' ||
        amount <= 0
    ) {
        return res.status(400).json(
            createRejectedResponse(
                'Invalid payment information',
                amount,
                payerId,
                payerEmail,
                cardNumber,
                cvv
            )
        )
    }
    // Simulate an internal SnailPay service error
    if (cardNumber === '9999999999999999') {
        return res.status(500).json({
            id: crypto.randomUUID(),
            status: 'error',
            status_detail: 'Internal SnailPay service error',
            transaction_amount: amount,
            date_created: new Date().toISOString(),
            authorization_code: null,
            reference: `SNAIL-${Date.now()}`,
            payer_id: payerId,
            payer_email: payerEmail,
            card_number: cardNumber,
            cvv: cvv,
        })
    }
    // Simulate a rejected card
    if (cardNumber !== '1234123412341234') {
        return res.status(400).json(
            createRejectedResponse(
                'Card rejected',
                amount,
                payerId,
                payerEmail,
                cardNumber,
                cvv
            )
        )
    }

    // Validate expiration date and CVV
    if (
        expirationDate !== '12/26' ||
        cvv !== '543'
    ) {
        return res.status(400).json(
            createRejectedResponse(
                'Invalid card details',
                amount,
                payerId,
                payerEmail,
                cardNumber,
                cvv
            )
        )
    }

    // If all validations pass, approve the payment
    return res.status(200).json({
        id: crypto.randomUUID(),
        status: 'approved',
        status_detail: 'Payment approved',
        transaction_amount: amount,
        date_created: new Date().toISOString(),
        authorization_code: crypto.randomUUID().slice(0, 8).toUpperCase(),
        reference: `SNAIL-${Date.now()}`,
        payer_id: payerId,
        payer_email: payerEmail,
        card_number: cardNumber,
        cvv: cvv,
    })
})

export default router