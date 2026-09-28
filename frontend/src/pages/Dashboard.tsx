import { useState } from 'react'
import type { User } from '../types/User'

import {
    AppBar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import TodayRoundedIcon from '@mui/icons-material/TodayRounded'

import {
    PieChart,
    Pie,
    Cell,
    Tooltip as ReTooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts'

import { betResults, snailWins } from '../data/dashboardData'
import AddBalanceForm from '../components/AddBalanceForm'

interface DashboardProps {
    user: User
    onLogout: () => void
    onUserUpdate: (updatedUser: User) => void
}

type DashboardView = 'dashboard' | 'add-balance'

const drawerWidth = 240

// Theme-aligned chart colours
const PIE_COLORS = ['#1565C0', '#C0392B']
const BAR_COLOR = '#1565C0'

// ── Sidebar nav content shared between permanent and temporary drawers ───────
function SidebarContent({
    currentView,
    onNavigate,
    onLogout,
}: {
    currentView: DashboardView
    onNavigate: (view: DashboardView) => void
    onLogout: () => void
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {/* Branding */}
            <Toolbar
                sx={{
                    minHeight: '64px !important',
                    px: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SpeedRoundedIcon
                        sx={{ color: '#A0C8AE', fontSize: 26 }}
                        aria-hidden="true"
                    />
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#FFFFFF', letterSpacing: -0.3 }}
                    >
                        Snail Racing
                    </Typography>
                </Box>
            </Toolbar>

            <Divider />

            {/* Main navigation */}
            <List sx={{ flexGrow: 1, pt: 1 }}>
                <ListItemButton
                    selected={currentView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                    aria-current={currentView === 'dashboard' ? 'page' : undefined}
                >
                    <ListItemIcon>
                        <DashboardRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton
                    selected={currentView === 'add-balance'}
                    onClick={() => onNavigate('add-balance')}
                    aria-current={currentView === 'add-balance' ? 'page' : undefined}
                >
                    <ListItemIcon>
                        <AddCardRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Balance" />
                </ListItemButton>
            </List>

            <Divider />

            {/* Logout at the bottom */}
            <List sx={{ pb: 1 }}>
                <Tooltip title="Sign out" placement="right">
                    <ListItemButton onClick={onLogout} aria-label="Logout">
                        <ListItemIcon>
                            <LogoutRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Tooltip>
            </List>
        </Box>
    )
}

function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
    // Controls which section of the dashboard is currently visible
    const [currentView, setCurrentView] = useState<DashboardView>('dashboard')
    // Controls the mobile drawer open state
    const [mobileOpen, setMobileOpen] = useState(false)

    const theme = useTheme()
    // Hide the permanent sidebar on screens smaller than md (tablet/mobile)
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const handleNavigate = (view: DashboardView) => {
        setCurrentView(view)
        setMobileOpen(false)
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

            {/* ── Mobile AppBar ──────────────────────────────────────────── */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            aria-label="Open navigation menu"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            sx={{ mr: 1.5 }}
                        >
                            {mobileOpen ? (
                                <CloseRoundedIcon />
                            ) : (
                                <MenuRoundedIcon />
                            )}
                        </IconButton>

                        <SpeedRoundedIcon sx={{ mr: 1, fontSize: 22 }} aria-hidden="true" />

                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Snail Racing
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* ── Temporary Drawer (mobile) ──────────────────────────────── */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <SidebarContent
                        currentView={currentView}
                        onNavigate={handleNavigate}
                        onLogout={onLogout}
                    />
                </Drawer>
            )}

            {/* ── Permanent Drawer (desktop) ─────────────────────────────── */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <SidebarContent
                        currentView={currentView}
                        onNavigate={handleNavigate}
                        onLogout={onLogout}
                    />
                </Drawer>
            )}

            {/* ── Main content area ─────────────────────────────────────── */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    p: { xs: 2, sm: 3, md: 4 },
                    // On mobile, add top padding to avoid being hidden behind the AppBar
                    pt: { xs: 9, md: 4 },
                }}
            >
                {/* ── Dashboard view ─────────────────────────────────────── */}
                {currentView === 'dashboard' && (
                    <>
                        {/* Page header */}
                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.6rem', md: '2rem' },
                                    color: 'text.primary',
                                }}
                            >
                                Welcome, {user.fullName}
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                Here is your racing activity for today.
                            </Typography>
                        </Box>

                        {/* ── Summary stat cards ─────────────────────────────── */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                },
                                gap: 2.5,
                                mb: 3,
                            }}
                        >
                            {/* Balance card */}
                            <Card>
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                        aria-hidden="true"
                                    >
                                        <AccountBalanceWalletRoundedIcon
                                            sx={{ color: '#fff', fontSize: 24 }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Current Balance
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '1.6rem', md: '2rem' },
                                                color: 'text.primary',
                                                lineHeight: 1.2,
                                                mt: 0.25,
                                            }}
                                        >
                                            ${user.balance.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Today's races card */}
                            <Card>
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                        aria-hidden="true"
                                    >
                                        <TodayRoundedIcon
                                            sx={{ color: '#fff', fontSize: 24 }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            Today&apos;s Races
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: { xs: '1.6rem', md: '2rem' },
                                                color: 'text.primary',
                                                lineHeight: 1.2,
                                                mt: 0.25,
                                            }}
                                        >
                                            6
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* ── Charts ─────────────────────────────────────────── */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    lg: 'repeat(2, 1fr)',
                                },
                                gap: 2.5,
                            }}
                        >
                            {/* Donut chart – bet results */}
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 1,
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Bet Results
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip
                                                label="Won"
                                                size="small"
                                                sx={{
                                                    bgcolor: '#DDEEFF',
                                                    color: '#0D47A1',
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                            <Chip
                                                label="Lost"
                                                size="small"
                                                sx={{
                                                    bgcolor: '#FDECEA',
                                                    color: '#C0392B',
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={betResults}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={65}
                                                    outerRadius={100}
                                                    paddingAngle={3}
                                                >
                                                    {betResults.map((_entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>

                                                <ReTooltip
                                                    contentStyle={{
                                                        borderRadius: 8,
                                                        border: '1px solid #E4EDE7',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                    }}
                                                />

                                                <Legend
                                                    formatter={(value) => (
                                                        <span
                                                            style={{
                                                                color: '#1A2B22',
                                                                fontWeight: 600,
                                                                fontSize: 13,
                                                            }}
                                                        >
                                                            {value}
                                                        </span>
                                                    )}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Bar chart – snail victories */}
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <EmojiEventsRoundedIcon
                                            sx={{ color: 'primary.main', fontSize: 22 }}
                                            aria-hidden="true"
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Snail Victories
                                        </Typography>
                                    </Box>

                                    <Box sx={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart
                                                data={snailWins}
                                                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#E4EDE7"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                    tick={{
                                                        fill: '#5A7263',
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />

                                                {/* Victories are whole numbers, so decimals are disabled */}
                                                <YAxis
                                                    allowDecimals={false}
                                                    tick={{
                                                        fill: '#5A7263',
                                                        fontSize: 13,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />

                                                <ReTooltip
                                                    contentStyle={{
                                                        borderRadius: 8,
                                                        border: '1px solid #E4EDE7',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                    }}
                                                />

                                                <Bar
                                                    dataKey="wins"
                                                    name="Wins"
                                                    fill={BAR_COLOR}
                                                    radius={[6, 6, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                )}

                {/* ── Add Balance view ───────────────────────────────────── */}
                {currentView === 'add-balance' && (
                    <>
                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '1.6rem', md: '2rem' },
                                }}
                            >
                                Add Balance
                            </Typography>

                            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                                Recharge your balance using SnailPay.
                            </Typography>
                        </Box>

                        <AddBalanceForm user={user} onUserUpdate={onUserUpdate} />
                    </>
                )}
            </Box>
        </Box>
    )
}

export default Dashboard