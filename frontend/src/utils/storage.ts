import type { User } from '../types/User'
import type { SnailPayResponse } from '../types/SnailPay'

const USERS_KEY = 'users'
const CURRENT_USER_KEY = 'currentUserId'

export function getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY)

    if (!users) {
        return []
    }

    return JSON.parse(users) as User[]
}

export function saveUser(user: User): void {
    const users = getUsers()

    users.push(user)

    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email: string): User | undefined {
    const users = getUsers()

    return users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    )
}

export function setCurrentUser(userId: string): void {
    localStorage.setItem(CURRENT_USER_KEY, userId)
}

export function getCurrentUser(): User | undefined {
    const userId = localStorage.getItem(CURRENT_USER_KEY)

    if (!userId) {
        return undefined
    }

    return getUsers().find((user) => user.id === userId)
}

export function clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY)
}

// Updates the balance of an existing user
export function updateUserBalance(
    userId: string,
    newBalance: number
): User | undefined {
    const users = getUsers()
    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
        return undefined
    }

    users[userIndex].balance = newBalance
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    return users[userIndex]
}

const SNAILPAY_TRANSACTIONS_KEY = 'snailPayTransactions'

// Stores simulated SnailPay responses in LocalStorage
export function saveSnailPayTransaction(
    transaction: SnailPayResponse
): void {
    const storedTransactions = localStorage.getItem(
        SNAILPAY_TRANSACTIONS_KEY
    )

    const transactions: SnailPayResponse[] = storedTransactions
        ? JSON.parse(storedTransactions)
        : []

    transactions.push(transaction)

    localStorage.setItem(
        SNAILPAY_TRANSACTIONS_KEY,
        JSON.stringify(transactions)
    )
}
