import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginLayout from './LoginLayout'
import { CurrentUserContext } from '../context'

describe('The LoginLayout component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well', async () => {
    render(<LoginLayout login={() => true} switchToRegister={() => {}} />)

    const titleComp = await screen.findByLabelText('login-layout-title')
    expect(titleComp).toHaveTextContent('Log In')

    const inputEmail = screen.getByLabelText('input-email')
    within(inputEmail).getByRole('textbox')

    const inputPassword = screen.getByLabelText('input-password')
    within(inputPassword).getByLabelText('native-input-password')

    const loginError = await screen.queryByTestId('login-error')
    expect(loginError).not.toBeInTheDocument()

    screen.getByTestId('link-register')

    const btnLogin = screen.getByRole('button', { name: 'btn-login' })
    expect(btnLogin).toBeDisabled()
  })

  it('triggers log-in when clicking on the validation button', async () => {
    const mockLogin = jest.fn().mockImplementation(() => true)
    const mockOnLogin = jest.fn()
    render(
      <CurrentUserContext.Provider
        value={{
          email: undefined,
          onLogin: mockOnLogin
        }}
      >
        <LoginLayout login={mockLogin} switchToRegister={() => {}} />
      </CurrentUserContext.Provider>
    )
    await screen.findByLabelText('login-layout-title')

    const inputEmail = screen.getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    const inputPassword = screen.getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    const btnLogin = screen.getByRole('button', { name: 'btn-login' })
    expect(btnLogin).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnLogin))

    // Checks the call of the login function
    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password')

    // Checks the call of the onLogin function
    expect(mockOnLogin).toHaveBeenCalledWith('test@test.com')
  })

  it('must display an error if the login failed', async () => {
    const mockLogin = jest.fn().mockImplementation(() => false)
    render(<LoginLayout login={mockLogin} switchToRegister={() => {}} />)
    await screen.findByLabelText('login-layout-title')

    const inputEmail = screen.getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    const inputPassword = screen.getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    const btnLogin = screen.getByRole('button', { name: 'btn-login' })
    expect(btnLogin).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnLogin))

    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password')

    // Checks the display of the error
    const loginError = await screen.findByTestId('login-error')
    expect(loginError).toBeInTheDocument()
    expect(loginError).toHaveTextContent('Login failed')
  })

  it('can switch to register', async () => {
    const mockSwitchToRegister = jest.fn().mockImplementation(() => false)
    render(<LoginLayout login={() => true} switchToRegister={mockSwitchToRegister} />)
    await screen.findByLabelText('login-layout-title')

    const linkRegister = screen.getByTestId('link-register')
    await waitFor(() => userEvent.click(linkRegister))

    expect(mockSwitchToRegister).toHaveBeenCalledWith()
  })
})
