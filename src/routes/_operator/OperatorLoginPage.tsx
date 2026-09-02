import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useAuth } from '@/hooks/auth/useAuth'
import { useLogin } from '@/hooks/auth/useLogin'

export default function OperatorLoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, hasBootstrapped, bootstrap } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { loading, error, submit } = useLogin()

  useEffect(() => {
    if (!hasBootstrapped) void bootstrap()
  }, [hasBootstrapped, bootstrap])

  /** Valida email e palavra-passe antes de submeter. */
  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email inválido'
    if (!password || password.length < 6) {
      newErrors.password = 'Palavra-passe deve ter pelo menos 6 caracteres'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /** Autentica o operador contra o servidor e navega para a área do operador. */
  const handleSubmit = async () => {
    if (!validate()) return
    const ok = await submit(email, password)
    if (ok) navigate('/operator')
  }

  if (hasBootstrapped && isAuthenticated) {
    return <Navigate to="/operator" replace />
  }

  return (
    <div className="relative min-h-screen bg-[#F9FAFB] flex flex-col items-center px-6 overflow-hidden font-outfit">
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <header className="relative z-10 w-full max-w-sm text-center flex flex-col items-center gap-8">
          <div className="w-16 h-16 bg-[#1B7A3D] rounded-full" />
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="text-3xl font-bold font-outfit">C-Trip Angola</h1>
            <p className="text-[#4B5563] text-sm font-medium">Área do Operador</p>
          </div>
        </header>

        <section className="w-full max-w-sm text-left mt-8">
          <label htmlFor="operator-email" className="block text-sm font-medium text-gray-700 mb-2 font-outfit">
            Email
          </label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="operator-email"
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

          <label htmlFor="operator-password" className="block text-sm font-medium text-gray-700 mb-2 mt-4 font-outfit">
            Palavra-passe
          </label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="operator-password"
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
              aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
               hover:text-gray-600 transition-colors"
            >
              {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
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
        </section>
      </main>
    </div>
  )
}
