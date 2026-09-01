import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useLogin } from '@/hooks/auth/useLogin'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { loading, error, submit } = useLogin()

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido'
    if (!password || password.length < 6) newErrors.password = 'Palavra-passe deve ter pelo menos 6 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validate()) {
      const ok = await submit(email, password)
      if (ok) {
        const from = (location.state as { from?: string } | null)?.from
        navigate(from || '/search')
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F9FAFB] flex flex-col items-center px-6 overflow-hidden font-outfit">
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <header className="relative z-10 w-full max-w-sm text-center flex flex-col items-center
         justify-center gap-8 ">
          <div className="w-16 h-16 bg-[#1B7A3D] rounded-full"></div>
          <div className="flex flex-col items-center justify-center gap-2">
           <h1 className="text-3xl font-bold font-outfit">C-trip Angola</h1>
           <p className="text-[#4B5563] text-sm">Bilhetes de autocarro na ponta dos dedos</p>
          </div>
        </header>
        <section className="w-full max-w-sm text-left mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-outfit">
            Email
          </label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduza o seu email"
              className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-gray-50 pl-10 pr-4 h-12
               text-sm font-outfit text-gray-800 outline-none transition-colors
               focus:border-green-500`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 font-outfit">{errors.email}</p>}

          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4 font-outfit">
            Palavra-passe
          </label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduza a sua palavra-passe"
              className={`w-full rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-gray-50 pl-10 pr-12 h-12
               text-sm font-outfit text-gray-800 outline-none transition-colors
               focus:border-green-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
               hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <IconEyeOff className="w-5 h-5" />
              ) : (
                <IconEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 font-outfit">{errors.password}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(90deg, #6B9E8C 0%, #3A6356 100%)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              opacity: loading ? 0.6 : 1,
            }}
            className="w-full mt-8 px-6 text-base text-white
             transition-opacity hover:opacity-90 active:opacity-80
             disabled:cursor-not-allowed"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>

          {error && (
            <p className="text-red-500 text-xs mt-4 text-center font-outfit">{error}</p>
          )}

          <div className="flex items-center gap-3 w-full mt-6">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-gray-400 whitespace-nowrap">ou continuar com</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <button
            type="button"
            style={{
              height: 48,
              borderRadius: 14,
              border: '1.5px solid #3A6356',
              background: 'transparent',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
            }}
            className="w-full mt-6 px-6 text-base text-[#3A6356]
             transition-colors hover:bg-[#3A6356]/5 active:bg-[#3A6356]/10"
          >
            Entrar com Google
          </button>
        </section>
        <p className="text-sm text-gray-500 font-outfit mt-6">
          Não tem conta?{' '}
          <Link to="/auth/register" className="text-[#3A6356] font-semibold underline">
            Criar conta
          </Link>
        </p>
      </main>
      <footer className="w-full max-w-sm py-4 text-center">
        <p className="text-xs text-gray-400 font-outfit leading-relaxed">
          Ao continuar, concorda com os nossos{' '}
          <span className="underline cursor-pointer font-normal">Termos de Serviço</span>
          {' '}e{' '}
          <span className="underline cursor-pointer font-semibold">Política de Privacidade</span>.
        </p>
      </footer>
    </div>
  )
}
