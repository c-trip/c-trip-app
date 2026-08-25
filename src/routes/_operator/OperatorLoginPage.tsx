import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IconKey } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'

const VALID_CODE = '123456'
const MOCK_OPERATOR = { name: 'Carlos Mendes', company: 'Macon' }

export default function OperatorLoginPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const handleChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6))
  }

  const handleSubmit = () => {
    if (code.length !== 6) {
      gooeyToast.error('Código incompleto', {
        description: 'O código deve ter 6 dígitos.',
      })
      return
    }
    if (code !== VALID_CODE) {
      gooeyToast.error('Código inválido', {
        description: 'O código de acesso não é válido.',
      })
      return
    }
    sessionStorage.setItem(
      'operatorSession',
      JSON.stringify({ operatorCode: code, ...MOCK_OPERATOR })
    )
    gooeyToast.success('Bem-vindo', {
      description: `Olá, ${MOCK_OPERATOR.name}!`,
    })
    navigate('/operator')
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 overflow-hidden font-outfit">
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
          <div className="w-full h-12 flex items-center gap-2 py-2 px-4 rounded-xl bg-gray-50">
            <IconKey className="text-[#9CA3AF]" />
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Digite o seu código"
              maxLength={6}
              className="p-2 w-full h-full text-[#4B5563] bg-transparent outline-none"
            />
          </div>

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
    </div>
  )
}
