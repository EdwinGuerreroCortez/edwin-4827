import type { User } from '../types/User'
import {
    PieChart,
    Pie,
    Tooltip,
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

function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
    return (
        <main>
            <h1>Welcome, {user.fullName}</h1>

            <p>Balance: ${user.balance}</p>

            {/* Form used to add balance through the simulated SnailPay service */}
            <AddBalanceForm
                user={user}
                onUserUpdate={onUserUpdate}
            />
            {/* Donut chart with simulated won and lost bets */}
            <section>
                <h2>Bet Results</h2>
                {/* Bar chart with the simulated victories of each snail */}
                <section>
                    <h2>Snail Victories</h2>

                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={snailWins}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                {/* Victories are whole numbers, so decimals are disabled */}
                                <YAxis allowDecimals={false} />

                                <Tooltip />

                                <Bar
                                    dataKey="wins"
                                    name="Wins"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={betResults}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                            />

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <button onClick={onLogout}>
                Logout
            </button>
        </main>
    )
}

export default Dashboard