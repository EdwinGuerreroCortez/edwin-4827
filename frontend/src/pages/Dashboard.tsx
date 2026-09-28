import type { User } from '../types/User'

interface DashboardProps {
    user: User
    onLogout: () => void
}

function Dashboard({ user, onLogout }: DashboardProps) {
    return (
        <main>
            <h1>Welcome, {user.fullName}</h1>

            <p>Balance: ${user.balance}</p>

            <button onClick={onLogout}>
                Logout
            </button>
        </main>
    )
}

export default Dashboard