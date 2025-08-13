import { useState } from 'react'
import { Box } from '@mui/material'
import { RegisterLayout, LoginLayout } from '../components'
import { useUserConnector } from '../hooks'

export default function LoginPage() {
  const [showRegisterLayout, setShowRegisterLayout] = useState<boolean>()
  const { register, login } = useUserConnector()

  return (
    <Box
      component="div"
      aria-label="login-page"
      sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {showRegisterLayout ? (
        <RegisterLayout
          dataTestId="register-layout"
          register={register}
          switchToLogin={() => setShowRegisterLayout(false)}
          onRegistered={() => setShowRegisterLayout(false)}
        />
      ) : (
        <LoginLayout
          dataTestId="login-layout"
          login={login}
          switchToRegister={() => setShowRegisterLayout(true)}
        />
      )}
    </Box>
  )
}
