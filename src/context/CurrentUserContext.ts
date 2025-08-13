import { createContext } from 'react'

interface CurrentUserContextData {
  email: string | undefined
  onLogin: (email: string) => void
}

export const CurrentUserContext = createContext<CurrentUserContextData>({
  email: undefined,
  onLogin: () => {}
})
