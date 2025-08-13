import { useState } from 'react'
import { Alert, Box, Button, Grid, Link, Paper, TextField, Typography } from '@mui/material'

interface RegisterLayoutProps {
  dataTestId?: string
  register: (email: string, password: string) => boolean
  onRegistered: () => void
  switchToLogin: () => void
}

export default function RegisterLayout({
  dataTestId,
  register,
  onRegistered,
  switchToLogin
}: RegisterLayoutProps) {
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [registerError, setRegisterError] = useState<string>()

  const onClickRegister = (): void => {
    if (!!email && !!password) {
      if (register(email, password)) {
        onRegistered()
      } else {
        setRegisterError('Registration failed')
      }
    }
  }

  return (
    <Box
      component="div"
      aria-label="register-layout"
      data-testid={dataTestId}
      sx={{ maxWidth: '350px' }}
    >
      <Paper elevation={3}>
        <Typography
          aria-label="register-layout-title"
          variant="h4"
          style={{ paddingTop: '10px', paddingBottom: '30px', textAlign: 'center' }}
        >
          Register
        </Typography>
        <Box aria-label="register-layout-form" component="div">
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
            {!!registerError && (
              <Grid size={12} sx={{ textAlign: 'center' }}>
                <Alert data-testid="register-error" severity="success" color="error">
                  {registerError}
                </Alert>
              </Grid>
            )}
            <Grid size={12} sx={{ textAlign: 'right' }}>
              <Link data-testid="link-login" href="#" onClick={() => switchToLogin()}>
                Login
              </Link>
            </Grid>
            <Grid size={12} sx={{ textAlign: 'center' }}>
              <Button
                aria-label="btn-register"
                variant="contained"
                disabled={!email || !password}
                onClick={onClickRegister}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}
