import { useState } from 'react'
import { Alert, Box, Button, Grid, Link, Paper, TextField, Typography } from '@mui/material'
import { useCurrentUserContext } from '../context'

interface LoginLayoutProps {
  dataTestId?: string
  login: (email: string, password: string) => boolean
  switchToRegister: () => void
}

export default function LoginLayout({ dataTestId, login, switchToRegister }: LoginLayoutProps) {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [loginError, setLoginError] = useState<string>()
  const { onLogin } = useCurrentUserContext()

  const onClickLogin = (): void => {
    if (!!email && !!password) {
      if (login(email, password)) {
        onLogin(email)
      } else {
        setLoginError('Login failed')
      }
    }
  }

  return (
    <Box
      component="div"
      aria-label="login-layout"
      data-testid={dataTestId}
      sx={{ maxWidth: '350px' }}
    >
      <Paper elevation={3}>
        <Typography
          aria-label="login-layout-title"
          variant="h4"
          style={{ paddingTop: '10px', paddingBottom: '30px', textAlign: 'center' }}
        >
          Log In
        </Typography>
        <Box aria-label="login-layout-form" component="div">
          <Grid container spacing={2} alignContent="center" sx={{ padding: '20px' }}>
            <Grid size={12}>
              <TextField
                aria-label="input-email"
                fullWidth
                error={!email}
                label="Email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                aria-label="input-password"
                slotProps={{
                  htmlInput: {
                    'aria-label': 'native-input-password'
                  }
                }}
                type="password"
                fullWidth
                error={!password}
                label="Password"
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {!!loginError && (
              <Grid size={12} sx={{ textAlign: 'center' }}>
                <Alert data-testid="login-error" severity="success" color="error">
                  {loginError}
                </Alert>
              </Grid>
            )}
            <Grid size={12} sx={{ textAlign: 'right' }}>
              <Link data-testid="link-register" href="#" onClick={() => switchToRegister()}>
                Register
              </Link>
            </Grid>
            <Grid size={12} sx={{ textAlign: 'center' }}>
              <Button
                aria-label="btn-login"
                variant="contained"
                disabled={!email || !password}
                onClick={onClickLogin}
              >
                Log In
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}
