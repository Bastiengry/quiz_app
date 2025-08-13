import type { User } from '../types'

export const users: User[] = []

export default function useUserConnector() {
  const register = (email: string, password: string): boolean => {
    let result = false
    const matchingUser = users.find((user) => user.email === email && user.password === password)
    if (!matchingUser) {
      users.push({
        email,
        password
      })
      result = true
    }
    return result
  }

  const login = (email: string, password: string): boolean => {
    return !!users.find((user) => user.email === email && user.password === password)
  }

  return { register, login }
}
