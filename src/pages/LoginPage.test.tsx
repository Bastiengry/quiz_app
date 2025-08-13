import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './LoginPage'

const mockLogin = jest.fn()
const mockRegister = jest.fn()
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useUserConnector: () => ({
    login: mockLogin,
    register: mockRegister
  })
}))

describe('The LoginPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well and displays login page by default', async () => {
    render(<LoginPage />)

    // Waits for the screen to load
    const loginPage = await screen.findByLabelText('login-page')
    within(loginPage).getByTestId('login-layout')
  })

  it('can execute login method', async () => {
    mockLogin.mockImplementation(() => true)

    render(<LoginPage />)

    // Waits for the screen to load
    const loginPage = await screen.findByLabelText('login-page')

    const loginLayout = within(loginPage).getByTestId('login-layout')

    // Fills the email
    const inputEmail = within(loginLayout).getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    // Fills the password
    const inputPassword = within(loginLayout).getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    // Click on the button to validate
    const btnLogin = await within(loginLayout).findByLabelText('btn-login')
    await waitFor(() => userEvent.click(btnLogin))

    // Check the call of mockLogin method
    expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password')
  })

  it('can execute register method and go back to login layout', async () => {
    mockRegister.mockImplementation(() => true)

    render(<LoginPage />)

    // Waits for the screen to load
    const loginPage = await screen.findByLabelText('login-page')

    // Gets the login layout
    const loginLayout = within(loginPage).getByTestId('login-layout')

    // Switches to register layout
    const linkRegister = within(loginLayout).getByTestId('link-register')
    await waitFor(() => userEvent.click(linkRegister))

    // Gets the register layout
    const registerLayout = await within(loginPage).findByTestId('register-layout')

    // Fills the email
    const inputEmail = within(registerLayout).getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    // Fills the password
    const inputPassword = within(registerLayout).getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    // Click on the button to validate
    const btnRegister = await within(registerLayout).findByLabelText('btn-register')
    await waitFor(() => userEvent.click(btnRegister))

    // Check the call of mockRegister method
    expect(mockRegister).toHaveBeenCalledWith('test@test.com', 'password')

    // Check that the login layout is displayed
    const loginLayoutAfterRegister = within(loginPage).getByTestId('login-layout')
    expect(loginLayoutAfterRegister).toBeInTheDocument()
  })

  it('does not switch to login layout if cannot execute register method', async () => {
    mockRegister.mockImplementation(() => false)

    render(<LoginPage />)

    // Waits for the screen to load
    const loginPage = await screen.findByLabelText('login-page')

    // Gets the login layout
    const loginLayout = within(loginPage).getByTestId('login-layout')

    // Switches to register layout
    const linkRegister = within(loginLayout).getByTestId('link-register')
    await waitFor(() => userEvent.click(linkRegister))

    // Gets the register layout
    const registerLayout = await within(loginPage).findByTestId('register-layout')

    // Fills the email
    const inputEmail = within(registerLayout).getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    // Fills the password
    const inputPassword = within(registerLayout).getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    // Click on the button to validate
    const btnRegister = await within(registerLayout).findByLabelText('btn-register')
    await waitFor(() => userEvent.click(btnRegister))

    // Check the call of mockRegister method
    expect(mockRegister).toHaveBeenCalledWith('test@test.com', 'password')

    // Check that the login layout is NOT displayed
    const loginLayoutAfterRegister = within(loginPage).queryByTestId('login-layout')
    expect(loginLayoutAfterRegister).not.toBeInTheDocument()

    // Check that the register layout is displayed
    expect(registerLayout).toBeInTheDocument()
  })

  it('can switch to register then switch to login', async () => {
    render(<LoginPage />)

    // Waits for the screen to load
    const loginPage = await screen.findByLabelText('login-page')

    // Gets the login layout
    const loginLayout = within(loginPage).getByTestId('login-layout')

    // Switches to register layout
    const linkRegister = within(loginLayout).getByTestId('link-register')
    await waitFor(() => userEvent.click(linkRegister))

    // Gets the register layout
    const registerLayout = await within(loginPage).findByTestId('register-layout')

    // Switches to login layout
    const linkLogin = within(registerLayout).getByTestId('link-login')
    await waitFor(() => userEvent.click(linkLogin))

    // Check that the login layout is displayed
    const loginLayoutAfterRegister = within(loginPage).getByTestId('login-layout')
    expect(loginLayoutAfterRegister).toBeInTheDocument()

    // Check that the register layout is NOT displayed
    expect(registerLayout).not.toBeInTheDocument()
  })
})
