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
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'

import { hashPassword } from '../utils/password'
import { findUserByEmail, saveUser, setCurrentUser } from '../utils/storage'
import type { User } from '../types/User'

// Props used to notify App after registration or return to Login
interface RegisterProps {
    onRegister: (user: User) => void
    onGoToLogin: () => void
}

function Register({ onRegister, onGoToLogin }: RegisterProps) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')
        setIsLoading(true)

        if (!fullName || !email || !password || !confirmPassword) {
            setError('All fields are required')
            setIsLoading(false)
            return
        }

        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/

        if (fullName.trim().length < 3) {
            setError('Full name must contain at least 3 characters')
            setIsLoading(false)
            return
        }

        if (!nameRegex.test(fullName.trim())) {
            setError('Full name can only contain letters and spaces')
            setIsLoading(false)
            return
        }

        if (!email.includes('@')) {
            setError('Enter a valid email address')
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError('Password must contain at least 8 characters')
            setIsLoading(false)
            return
        }

        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter')
            setIsLoading(false)
            return
        }

        if (!/[0-9]/.test(password)) {
            setError('Password must contain at least one number')
            setIsLoading(false)
            return
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            setError('Password must contain at least one special character')
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        // Check if the email is already registered
        const existingUser = findUserByEmail(email.trim())

        if (existingUser) {
            setError('An account with this email already exists')
            setIsLoading(false)
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

        // Save the new user
        saveUser(newUser)

        // Start a session automatically after registration
        setCurrentUser(newUser.id)

        // Notify App that registration was successful
        onRegister(newUser)

        console.log('User registered successfully')
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
                    maxWidth: 440,
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
                    Create account
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Fill in the details below to get started.
                </Typography>

                {/* Registration form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        id="fullName"
                        label="Full Name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        fullWidth
                        autoComplete="name"
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
                        autoComplete="new-password"
                        helperText="Min. 8 chars, one uppercase, one number, one special character"
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
                                                <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                                            ) : (
                                                <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                        autoComplete="new-password"
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
                                                showConfirmPassword
                                                    ? 'Hide confirm password'
                                                    : 'Show confirm password'
                                            }
                                            onClick={() =>
                                                setShowConfirmPassword((prev) => !prev)
                                            }
                                            edge="end"
                                            size="small"
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOffRoundedIcon sx={{ fontSize: 20 }} />
                                            ) : (
                                                <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {/* Validation error */}
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
                        {isLoading ? 'Creating account…' : 'Create Account'}
                    </Button>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 1 }}
                    >
                        Already have an account?{' '}
                        <Link
                            component="button"
                            type="button"
                            onClick={onGoToLogin}
                            sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                textDecorationColor: 'primary.main',
                            }}
                        >
                            Login
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}

export default Register