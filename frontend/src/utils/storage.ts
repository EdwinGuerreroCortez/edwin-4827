import type { User } from '../types/User'

const USERS_KEY = 'users'

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