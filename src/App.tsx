import { Box, CssBaseline } from '@mui/material'
import './App.css'
import QuizPage from './pages/QuizPage'
import AppBar from './components/AppBar'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import { CurrentUserContext } from './context'
import type { CurrentUser } from './types'

function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>()

  const onLogin = (email: string) => {
    setCurrentUser({
      email
    })
  }

  const onLogout = () => {
    setCurrentUser(undefined)
  }

  return (
    <Box className="app">
      <CssBaseline />
      <CurrentUserContext.Provider
        value={{
          email: currentUser?.email,
          onLogin: onLogin
        }}
      >
        <AppBar onLogout={onLogout} />
        <Box component="main" className="app-content">
          {!currentUser && <LoginPage />}
          {!!currentUser && <QuizPage />}
        </Box>
      </CurrentUserContext.Provider>
    </Box>
  )
}

export default App
