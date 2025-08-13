import { useContext } from 'react'
import { CurrentUserContext } from './CurrentUserContext'

const useCurrentUserContext = () => {
  const context = useContext(CurrentUserContext)
  if (!context) {
    throw new Error('Current user context undefined')
  }
  return context
}

export default useCurrentUserContext
