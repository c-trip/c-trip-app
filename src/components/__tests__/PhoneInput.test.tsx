import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import PhoneInput from '../PhoneInput'

describe('PhoneInput', () => {
  const defaultProps = {
    value: undefined as string | undefined,
    onChange: vi.fn(),
    defaultCountry: 'AO' as const,
    placeholder: 'Número de telefone',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza sem erros', () => {
    render(<PhoneInput {...defaultProps} />)
    expect(screen.getByPlaceholderText('Número de telefone')).toBeInTheDocument()
  })

  it('mostra código de país por defeito (+244 para Angola)', () => {
    render(<PhoneInput {...defaultProps} />)
    expect(screen.getByText('+244')).toBeInTheDocument()
  })

  it('mostra input de telefone', () => {
    render(<PhoneInput {...defaultProps} />)
    const input = screen.getByPlaceholderText('Número de telefone')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'tel')
    expect(input).toHaveAttribute('inputmode', 'numeric')
  })

  it('mostra botão do dropdown', () => {
    render(<PhoneInput {...defaultProps} />)
    const dropdownButton = screen.getByText('+244').closest('button')
    expect(dropdownButton).toBeInTheDocument()
  })

  it('chama onChange removendo caracteres não numéricos', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<PhoneInput {...defaultProps} onChange={onChange} />)

    const input = screen.getByPlaceholderText('Número de telefone')
    await user.type(input, '9')

    expect(onChange).toHaveBeenCalledWith('+2449')
  })

  it('limpa o valor ao apagar todos os dígitos', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<PhoneInput {...defaultProps} onChange={onChange} value="+244951616" />)

    const input = screen.getByPlaceholderText('Número de telefone')
    await user.clear(input)

    expect(onChange).toHaveBeenCalledWith(undefined)
  })

  it('abre dropdown ao clicar no botão do país', async () => {
    const user = userEvent.setup()
    render(<PhoneInput {...defaultProps} />)

    const dropdownButton = screen.getByText('+244').closest('button')!
    await user.click(dropdownButton)

    expect(screen.getByPlaceholderText('Procurar país...')).toBeInTheDocument()
  })

  it('filtra países ao pesquisar no dropdown', async () => {
    const user = userEvent.setup()
    render(<PhoneInput {...defaultProps} />)

    const dropdownButton = screen.getByText('+244').closest('button')!
    await user.click(dropdownButton)

    const searchInput = screen.getByPlaceholderText('Procurar país...')
    await user.type(searchInput, 'Brasil')

    expect(screen.getByText(/Brasil/)).toBeInTheDocument()
  })

  it('mostra counter de dígitos quando há número', () => {
    render(<PhoneInput {...defaultProps} value="+244951" />)
    expect(screen.getByText(/\d+\/\d+/)).toBeInTheDocument()
  })

  it('mostra formato internacional abaixo do input', () => {
    render(<PhoneInput {...defaultProps} value="+244951616197" />)
    expect(screen.getByText('+244 951 616 197')).toBeInTheDocument()
  })
})
