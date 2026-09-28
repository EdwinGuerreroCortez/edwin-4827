import { useState } from 'react'
import { comparePassword } from '../utils/password'
import { findUserByEmail, setCurrentUser } from '../utils/storage'
import type { User } from '../types/User'

// Props used to notify App when the login is successful
interface LoginProps {
    onLogin: (user: User) => void
    onGoToRegister: () => void
}

function Login({ onLogin, onGoToRegister }: LoginProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')

        if (!email || !password) {
            setError('Email and password are required')
            return
        }

        const user = findUserByEmail(email.trim())

        if (!user) {
            setError('Invalid email or password')
            return
        }

        const isPasswordValid = await comparePassword(
            password,
            user.passwordHash
        )

        if (!isPasswordValid) {
            setError('Invalid email or password')
            return
        }

        // Save the session in LocalStorage
        setCurrentUser(user.id)

        // Notify App that the user logged in successfully
        onLogin(user)

        console.log('Login successful')
    }

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
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

                {error && <p>{error}</p>}

                <button type="submit">Login</button>
                <p>
                    Don't have an account?{' '}
                    <a
                        href="#register"
                        onClick={(event) => {
                            event.preventDefault()
                            onGoToRegister()
                        }}
                    >
                        Register
                    </a>
                </p>
            </form>
        </main>
    )
}

export default Login