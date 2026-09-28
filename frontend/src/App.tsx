import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { clearCurrentUser, getCurrentUser } from './utils/storage'
import type { User } from './types/User'

// Possible authentication screens when there is no active session
type AuthView = 'login' | 'register'

function App() {
  // Restore the logged-in user from LocalStorage when the app loads
  const [currentUser, setCurrentUser] = useState<User | undefined>(
    () => getCurrentUser()
  )

  // Controls whether the Login or Register screen is displayed
  const [authView, setAuthView] = useState<AuthView>('login')

  // Remove the active session and return to the Login screen
  const handleLogout = () => {
    clearCurrentUser()
    setCurrentUser(undefined)
    setAuthView('login')
  }

  // If a user is logged in, show the Dashboard
  if (currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    )
  }

  // If there is no session and the user selected Register,
  // show the registration screen
  if (authView === 'register') {
    return (
      <Register
        onRegister={setCurrentUser}
        onGoToLogin={() => setAuthView('login')}
      />
    )
  }

  // Login is the default screen when there is no active session
  return (
    <Login
      onLogin={setCurrentUser}
      onGoToRegister={() => setAuthView('register')}
    />
  )
}

export default App