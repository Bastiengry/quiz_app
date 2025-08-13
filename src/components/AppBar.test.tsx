import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppBar from './AppBar'
import { CurrentUserContext } from '../context'

describe('The AppBar component', () => {
  it('renders well when no user connected', async () => {
    render(
      <CurrentUserContext.Provider
        value={{
          email: undefined,
          onLogin: () => {}
        }}
      >
        <AppBar onLogout={() => {}} />
      </CurrentUserContext.Provider>
    )

    const appTitleComp = await screen.findByLabelText('app-title')
    expect(appTitleComp).toHaveTextContent('QuizApp')

    const btnLogout = await screen.queryByLabelText('btn-logout')
    expect(btnLogout).toBeNull()
  })

  it('renders well when user connected', async () => {
    render(
      <CurrentUserContext.Provider
        value={{
          email: 'quiz@test.com',
          onLogin: () => {}
        }}
      >
        <AppBar onLogout={() => {}} />
      </CurrentUserContext.Provider>
    )

    const appTitleComp = await screen.findByLabelText('app-title')
    expect(appTitleComp).toHaveTextContent('QuizApp')

    const btnLogout = await screen.findByLabelText('btn-logout')
    expect(btnLogout).toHaveTextContent('Logout')
  })

  it('calls logout method when clicking on logout button', async () => {
    let logoutCalled = false
    render(
      <CurrentUserContext.Provider
        value={{
          email: 'quiz@test.com',
          onLogin: () => {}
        }}
      >
        <AppBar
          onLogout={() => {
            logoutCalled = true
          }}
        />
      </CurrentUserContext.Provider>
    )

    const appTitleComp = await screen.findByLabelText('app-title')
    expect(appTitleComp).toHaveTextContent('QuizApp')

    const btnLogout = await screen.findByLabelText('btn-logout')
    await userEvent.click(btnLogout)
    expect(logoutCalled).toBe(true)
  })
})
