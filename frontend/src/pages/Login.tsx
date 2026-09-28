import { useState } from 'react'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'

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
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')
        setIsLoading(true)

        if (!email || !password) {
            setError('Email and password are required')
            setIsLoading(false)
            return
        }

        const user = findUserByEmail(email.trim())

        if (!user) {
            setError('Invalid email or password')
            setIsLoading(false)
            return
        }

        const isPasswordValid = await comparePassword(
            password,
            user.passwordHash
        )

        if (!isPasswordValid) {
            setError('Invalid email or password')
            setIsLoading(false)
            return
        }

        // Save the session in LocalStorage
        setCurrentUser(user.id)

        // Notify App that the user logged in successfully
        onLogin(user)

        console.log('Login successful')
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(145deg, #F4F6F2 0%, #E8F0EA 100%)',
                p: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    p: { xs: 3, sm: 5 },
                    borderRadius: 4,
                    border: '1px solid #D6E4DC',
                    boxShadow: '0 8px 40px rgba(30,70,40,0.10)',
                }}
            >
                {/* Branding */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            boxShadow: '0 4px 14px rgba(21,101,192,0.30)',
                        }}
                        aria-hidden="true"
                    >
                        <SpeedRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>

                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: -0.5 }}
                    >
                        Snail Racing
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        The premier snail racing platform
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3, borderColor: 'divider' }} />

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 700, mb: 0.5 }}
                >
                    Welcome back
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Sign in to your account to continue.
                </Typography>

                {/* Login form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        autoComplete="email"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailRoundedIcon
                                            sx={{ color: 'text.secondary', fontSize: 20 }}
                                        />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        id="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        autoComplete="current-password"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockRoundedIcon
                                            sx={{ color: 'text.secondary', fontSize: 20 }}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword
                                                    ? 'Hide password'
                                                    : 'Show password'
                                            }
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? (
                                                <VisibilityOffRoundedIcon
                                                    sx={{ fontSize: 20 }}
                                                />
                                            ) : (
                                                <VisibilityRoundedIcon
                                                    sx={{ fontSize: 20 }}
                                                />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* Authentication error */}
                    {error && (
                        <Alert severity="error" role="alert">
                            {error}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : undefined
                        }
                        sx={{ mt: 1, py: 1.4 }}
                    >
                        {isLoading ? 'Signing in…' : 'Login'}
                    </Button>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 1 }}
                    >
                        Don&apos;t have an account?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={onGoToRegister}
                            sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                textDecorationColor: 'primary.main',
                            }}
                        >
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}

export default Login