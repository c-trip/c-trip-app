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

  it('mostra label do campo de email', () => {
    renderLoginPage()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('mostra input de email', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText('Introduza o seu email')).toBeInTheDocument()
  })

  it('mostra label do campo de palavra-passe', () => {
    renderLoginPage()
    expect(screen.getByText('Palavra-passe')).toBeInTheDocument()
  })

  it('mostra input de palavra-passe', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText('Introduza a sua palavra-passe')).toBeInTheDocument()
  })

  it('mostra botão Entrar', () => {
    renderLoginPage()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('só mostra "Entrar com Google" quando VITE_GOOGLE_CLIENT_ID está configurado', () => {
    renderLoginPage()
    // Sem client id no ambiente de teste, o botão do Google não aparece.
    expect(screen.queryByText('Entrar com Google')).not.toBeInTheDocument()
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
