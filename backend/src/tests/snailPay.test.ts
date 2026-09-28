import request from 'supertest'
import { describe, expect, it } from 'vitest'
import app from '../app.js'

describe('SnailPay API', () => {
    // Verifies that the exact fictitious card data approves a payment
    it('should approve a valid payment', async () => {
        const response = await request(app)
            .post('/api/snailpay/payments')
            .send({
                cardNumber: '1234123412341234',
                expirationDate: '12/26',
                cvv: '543',
                fullName: 'Test User',
                amount: 100,
                payerId: 'test-user-id',
                payerEmail: 'test@example.com',
            })

        // The API must return a successful HTTP response
        expect(response.status).toBe(200)

        // The transaction must be approved
        expect(response.body.status).toBe('approved')
        expect(response.body.status_detail).toBe('Payment approved')
        expect(response.body.transaction_amount).toBe(100)

        // Required transaction information must be present
        expect(response.body.id).toBeDefined()
        expect(response.body.date_created).toBeDefined()
        expect(response.body.authorization_code).toBeDefined()
        expect(response.body.reference).toBeDefined()

        // Payer and fictitious card information must be returned
        expect(response.body.payer_id).toBe('test-user-id')
        expect(response.body.payer_email).toBe('test@example.com')
        expect(response.body.card_number).toBe('1234123412341234')
        expect(response.body.cvv).toBe('543')
    })

    // Verifies that an unknown card is rejected
    it('should reject an invalid card', async () => {
        const response = await request(app)
            .post('/api/snailpay/payments')
            .send({
                cardNumber: '1111111111111111',
                expirationDate: '12/26',
                cvv: '543',
                fullName: 'Test User',
                amount: 100,
                payerId: 'test-user-id',
                payerEmail: 'test@example.com',
            })

        expect(response.status).toBe(400)
        expect(response.body.status).toBe('rejected')
        expect(response.body.status_detail).toBe('Card rejected')
        expect(response.body.authorization_code).toBeNull()
    })

    // Verifies that an incorrect expiration date or CVV is rejected
    it('should reject invalid card details', async () => {
        const response = await request(app)
            .post('/api/snailpay/payments')
            .send({
                cardNumber: '1234123412341234',
                expirationDate: '12/26',
                cvv: '111',
                fullName: 'Test User',
                amount: 100,
                payerId: 'test-user-id',
                payerEmail: 'test@example.com',
            })

        expect(response.status).toBe(400)
        expect(response.body.status).toBe('rejected')
        expect(response.body.status_detail).toBe('Invalid card details')
        expect(response.body.authorization_code).toBeNull()
    })

    // Verifies the documented simulated internal SnailPay error
    it('should return a system error', async () => {
        const response = await request(app)
            .post('/api/snailpay/payments')
            .send({
                cardNumber: '9999999999999999',
                expirationDate: '12/26',
                cvv: '543',
                fullName: 'Test User',
                amount: 100,
                payerId: 'test-user-id',
                payerEmail: 'test@example.com',
            })

        expect(response.status).toBe(500)
        expect(response.body.status).toBe('error')
        expect(response.body.status_detail)
            .toBe('Internal SnailPay service error')
        expect(response.body.authorization_code).toBeNull()
    })

    // Verifies that the payment amount must be greater than zero
    it('should reject an invalid payment amount', async () => {
        const response = await request(app)
            .post('/api/snailpay/payments')
            .send({
                cardNumber: '1234123412341234',
                expirationDate: '12/26',
                cvv: '543',
                fullName: 'Test User',
                amount: 0,
                payerId: 'test-user-id',
                payerEmail: 'test@example.com',
            })

        expect(response.status).toBe(400)
        expect(response.body.status).toBe('rejected')
        expect(response.body.status_detail)
            .toBe('Invalid payment information')
        expect(response.body.authorization_code).toBeNull()
    })

    // Verifies that the payer name cannot be empty
    it('should reject an empty full name', async () => {
        const response = await request(app)
            .post('/api/snailpay/payments')
            .send({
                cardNumber: '1234123412341234',
                expirationDate: '12/26',
                cvv: '543',
                fullName: '',
                amount: 100,
                payerId: 'test-user-id',
                payerEmail: 'test@example.com',
            })

        expect(response.status).toBe(400)
        expect(response.body.status).toBe('rejected')
        expect(response.body.status_detail)
            .toBe('Invalid payment information')
        expect(response.body.authorization_code).toBeNull()
    })
})