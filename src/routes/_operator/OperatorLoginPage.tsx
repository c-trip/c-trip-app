import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IconKey, IconArrowLeft } from '@tabler/icons-react'

const VALID_CODE = '123456'
const MOCK_OPERATOR = { name: 'Carlos Mendes', company: 'Macon' }

export default function OperatorLoginPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos')
      return
    }
    if (code !== VALID_CODE) {
      setError('Código de acesso inválido')
      return
    }
    sessionStorage.setItem(
      'operatorSession',
      JSON.stringify({ operatorCode: code, ...MOCK_OPERATOR })
    )
    navigate('/operator')
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 overflow-hidden font-outfit">
      <button
        type="button"
        onClick={() => navigate('/welcome')}
        className="absolute top-6 left-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Voltar
      </button>

      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <header className="relative z-10 w-full max-w-sm text-center flex flex-col items-center gap-8">
          <div className="w-16 h-16 bg-[#1B7A3D] rounded-full" />
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold font-outfit">C-Trip Angola</h1>
            <p className="text-[#4B5563] text-sm font-medium">Área do Operador</p>
          </div>
        </header>

        <section className="w-full max-w-sm text-left mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-outfit">
            Código de Acesso
          </label>
          <div className="relative">
            <IconKey className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Introduza o seu código"
              maxLength={6}
              className={`w-full rounded-xl border ${
                error ? 'border-red-500' : 'border-gray-300'
              } bg-gray-50 pl-10 pr-4 h-12 text-sm font-outfit text-gray-800
              outline-none transition-colors focus:border-green-500 tracking-[0.3em] text-center text-lg`}
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1 font-outfit">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(90deg, #6B9E8C 0%, #3A6356 100%)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
            }}
            className="w-full mt-8 px-6 text-base text-white
             transition-opacity hover:opacity-90 active:opacity-80"
          >
            Entrar
          </button>
        </section>
      </main>

      <footer className="w-full max-w-sm py-4 text-center">
        <button
          type="button"
          onClick={() => navigate('/welcome')}
          className="text-sm text-[#3A6356] font-semibold underline font-outfit
           hover:text-[#2A4A3D] transition-colors"
        >
          Voltar ao início
        </button>
      </footer>
    </div>
  )
}
