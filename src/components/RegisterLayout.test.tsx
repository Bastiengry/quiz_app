import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterLayout } from '.'

describe('The RegisterLayout component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders well', async () => {
    render(
      <RegisterLayout register={() => true} switchToLogin={() => {}} onRegistered={() => {}} />
    )

    const titleComp = await screen.findByLabelText('register-layout-title')
    expect(titleComp).toHaveTextContent('Register')

    const inputEmail = screen.getByLabelText('input-email')
    within(inputEmail).getByRole('textbox')

    const inputPassword = screen.getByLabelText('input-password')
    within(inputPassword).getByLabelText('native-input-password')

    const registerError = await screen.queryByTestId('register-error')
    expect(registerError).not.toBeInTheDocument()

    screen.getByTestId('link-login')

    const btnRegister = screen.getByRole('button', { name: 'btn-register' })
    expect(btnRegister).toBeDisabled()
  })

  it('triggers registering when clicking on the validation button', async () => {
    const mockRegister = jest.fn().mockImplementation(() => true)
    const mockOnRegistered = jest.fn()
    render(
      <RegisterLayout
        register={mockRegister}
        switchToLogin={() => {}}
        onRegistered={mockOnRegistered}
      />
    )
    await screen.findByLabelText('register-layout-title')

    const inputEmail = screen.getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    const inputPassword = screen.getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    const btnRegister = screen.getByRole('button', { name: 'btn-register' })
    expect(btnRegister).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnRegister))

    // Checks the call of the register function
    expect(mockRegister).toHaveBeenCalledWith('test@test.com', 'password')

    // Checks the call of the onRegistered function
    expect(mockOnRegistered).toHaveBeenCalledWith()
  })

  it('must display an error if the registration failed', async () => {
    const mockRegister = jest.fn().mockImplementation(() => false)
    const mockOnRegistered = jest.fn()
    render(
      <RegisterLayout
        register={mockRegister}
        switchToLogin={() => {}}
        onRegistered={mockOnRegistered}
      />
    )

    await screen.findByLabelText('register-layout-title')

    const inputEmail = screen.getByLabelText('input-email')
    const nativeInputEmail = within(inputEmail).getByRole('textbox')
    await waitFor(() => userEvent.type(nativeInputEmail, 'test@test.com'))

    const inputPassword = screen.getByLabelText('input-password')
    const nativeInputPassword = within(inputPassword).getByLabelText('native-input-password')
    await waitFor(() => userEvent.type(nativeInputPassword, 'password'))

    const btnRegister = screen.getByRole('button', { name: 'btn-register' })
    expect(btnRegister).not.toBeDisabled()
    await waitFor(() => userEvent.click(btnRegister))

    expect(mockRegister).toHaveBeenCalledWith('test@test.com', 'password')

    // Checks the display of the error
    const registerError = await screen.findByTestId('register-error')
    expect(registerError).toBeInTheDocument()
    expect(registerError).toHaveTextContent('Registration failed')
  })

  it('can switch to login', async () => {
    const mockSwitchToLogin = jest.fn().mockImplementation(() => false)
    render(
      <RegisterLayout
        register={() => true}
        switchToLogin={mockSwitchToLogin}
        onRegistered={() => {}}
      />
    )

    await screen.findByLabelText('register-layout-title')

    const linkLogin = screen.getByTestId('link-login')
    await waitFor(() => userEvent.click(linkLogin))

    expect(mockSwitchToLogin).toHaveBeenCalledWith()
  })
})
