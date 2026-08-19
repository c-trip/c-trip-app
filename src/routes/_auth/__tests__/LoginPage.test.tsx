import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import LoginPage from '../LoginPage'

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('renderiza sem erros', () => {
    renderLoginPage()
    expect(screen.getByText('C-trip Angola')).toBeInTheDocument()
  })

  it('mostra subtitle', () => {
    renderLoginPage()
    expect(screen.getByText('Bilhetes de autocarro na ponta dos dedos')).toBeInTheDocument()
  })

  it('mostra label do campo de telefone', () => {
    renderLoginPage()
    expect(screen.getByText('Introduza o seu número de telefone')).toBeInTheDocument()
  })

  it('mostra input de telefone', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText('Número de telefone')).toBeInTheDocument()
  })

  it('mostra botão Continuar com Telefone', () => {
    renderLoginPage()
    expect(screen.getByText('Continuar com Telefone')).toBeInTheDocument()
  })

  it('mostra botão Entrar com Google', () => {
    renderLoginPage()
    expect(screen.getByText('Entrar com Google')).toBeInTheDocument()
  })

  it('mostra separador ou continuar com', () => {
    renderLoginPage()
    expect(screen.getByText('ou continuar com')).toBeInTheDocument()
  })

  it('mostra link Criar conta com rota /auth/register', () => {
    renderLoginPage()
    const link = screen.getByText('Criar conta')
    expect(link).toBeInTheDocument()
    expect(link.closest('a')).toHaveAttribute('href', '/auth/register')
  })

  it('mostra footer com Termos de Serviço e Política de Privacidade', () => {
    renderLoginPage()
    expect(screen.getByText('Termos de Serviço')).toBeInTheDocument()
    expect(screen.getByText('Política de Privacidade')).toBeInTheDocument()
  })
})
