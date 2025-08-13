export interface User {
  email: string
  password: string
}

export interface CurrentUser {
  email: string | undefined
}
