import { useState } from 'react'
import { hashPassword } from '../utils/password'
import { findUserByEmail, saveUser } from '../utils/storage'
import type { User } from '../types/User'

function Register() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')

        if (!fullName || !email || !password || !confirmPassword) {
            setError('All fields are required')
            return
        }

        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/

        if (fullName.trim().length < 3) {
            setError('Full name must contain at least 3 characters')
            return
        }

        if (!nameRegex.test(fullName.trim())) {
            setError('Full name can only contain letters and spaces')
            return
        }

        if (!email.includes('@')) {
            setError('Enter a valid email address')
            return
        }

        if (password.length < 8) {
            setError('Password must contain at least 8 characters')
            return
        }

        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter')
            return
        }

        if (!/[0-9]/.test(password)) {
            setError('Password must contain at least one number')
            return
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            setError('Password must contain at least one special character')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Check if the email is already registered
        const existingUser = findUserByEmail(email.trim())

        if (existingUser) {
            setError('An account with this email already exists')
            return
        }

        // Hash the password before storing it
        const passwordHash = await hashPassword(password)

        // Create the new user
        const newUser: User = {
            id: crypto.randomUUID(),
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            passwordHash,
            balance: 0,
        }

        // Save the user in LocalStorage
        saveUser(newUser)

        console.log('User registered successfully')
    }
    return (
        <main>
            <h1>Create account</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName">Full name</label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </div>

                {error && <p>{error}</p>}
                <button type="submit">Create account</button>            </form>
        </main>
    )
}

export default Register