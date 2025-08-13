import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useCurrentUserContext } from '../context'

interface AppBarProps {
  onLogout: () => void
}

export default function AppBar({ onLogout }: AppBarProps) {
  const { email } = useCurrentUserContext()

  return (
    <MuiAppBar sx={{ ariaLabel: 'app-bar' }} position="static">
      <Toolbar>
        <Typography aria-label="app-title" variant="h6" component="div" sx={{ flexGrow: 1 }}>
          QuizApp
        </Typography>
        {!!email && (
          <Button aria-label="btn-logout" color="inherit" onClick={onLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </MuiAppBar>
  )
}
