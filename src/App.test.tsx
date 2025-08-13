import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { users } from './hooks/useUserConnector'

describe('The App component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    users.length = 0
  })

  it('renders well and displays login page when no user connected', async () => {
    render(<App />)

    // Checks the display of the login page
    await screen.findByLabelText('login-page')
  })
  it('renders well and displays quiz page when user connected', async () => {
    render(<App />)

    // Checks the display of the login page
    const loginPage = await screen.findByLabelText('login-page')

    // Registers
    const linkRegister = within(loginPage).getByTestId('link-register')
    await waitFor(() => userEvent.click(linkRegister))

    const inputEmailRegister = within(loginPage).getByLabelText('input-email')
    const nativeInputEmailRegister = within(inputEmailRegister).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmailRegister, 'test@test.com'))

    const inputPasswordRegister = within(loginPage).getByLabelText('input-password')
    const nativeInputPasswordRegister =
      within(inputPasswordRegister).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPasswordRegister, 'password'))

    const btnRegister = within(loginPage).getByRole('button', { name: 'btn-register' })
    expect(btnRegister).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnRegister))

    // Logs in
    const inputEmailLogin = within(loginPage).getByLabelText('input-email')
    const nativeInputEmailLogin = within(inputEmailLogin).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmailLogin, 'test@test.com'))

    const inputPasswordLogin = within(loginPage).getByLabelText('input-password')
    const nativeInputPasswordLogin =
      within(inputPasswordLogin).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPasswordLogin, 'password'))

    const btnLogin = within(loginPage).getByRole('button', { name: 'btn-login' })
    expect(btnLogin).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnLogin))

    // Checks that the quiz page is displayed
    await screen.findByLabelText('quiz-page')
  })

  it('renders well and displays login page when user logs out', async () => {
    render(<App />)

    // Checks the display of the login page
    const loginPage = await screen.findByLabelText('login-page')

    // Registers
    const linkRegister = within(loginPage).getByTestId('link-register')
    await waitFor(() => userEvent.click(linkRegister))

    const btnRegister = await within(loginPage).findByRole('button', { name: 'btn-register' })

    const inputEmailRegister = within(loginPage).getByLabelText('input-email')
    const nativeInputEmailRegister = within(inputEmailRegister).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmailRegister, 'test@test.com'))

    const inputPasswordRegister = within(loginPage).getByLabelText('input-password')
    const nativeInputPasswordRegister =
      within(inputPasswordRegister).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPasswordRegister, 'password'))

    expect(btnRegister).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnRegister))

    // Logs in
    const btnLogin = await within(loginPage).findByRole('button', { name: 'btn-login' })

    const inputEmailLogin = within(loginPage).getByLabelText('input-email')
    const nativeInputEmailLogin = within(inputEmailLogin).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmailLogin, 'test@test.com'))

    const inputPasswordLogin = screen.getByLabelText('input-password')
    const nativeInputPasswordLogin =
      within(inputPasswordLogin).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPasswordLogin, 'password'))

    expect(btnLogin).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnLogin))

    // Checks that the quiz page is displayed
    await screen.findByLabelText('quiz-page')

    // Logs out
    const btnLogout = await screen.findByLabelText('btn-logout')
    await userEvent.click(btnLogout)

    // Checks that the quiz page is displayed
    await screen.findByLabelText('login-page')
  })
})
