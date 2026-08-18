import { useNavigate } from 'react-router'
import { useTypewriter } from '../../hooks/useTypewriter'

export default function WelcomePage() {
  const navigate = useNavigate()
  const title = useTypewriter('Olá, seja bem-vindo ao C-Trip', 55)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#3A6356] to-[#2A4A3D] px-6 overflow-hidden font-outfit">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-12 h-56 w-56 rounded-full bg-white/7 blur-2xl" />

      <div className="relative z-10 w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-white">
          C-Trip
        </h1>

        <p className="mt-8 text-4xl font-semibold text-white min-h-[2.25rem]">
          {title}
          <span className="inline-block w-[2px] h-[1.1em] ml-0.5 align-middle bg-white animate-pulse" />
        </p>
        <p className="mt-3 text-base text-white/70">
          Como deseja entrar?
        </p>

        <div className="mt-10 flex flex-col gap-[14px]">
          <button
            type="button"
            onClick={() => navigate('/search')}
            style={{
              height: 48,
              borderRadius: 14,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
            }}
            className="w-full px-6 text-base text-[#3A6356] bg-white transition-opacity hover:opacity-90 active:opacity-80"
          >
             Como Passageiro
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/30" />
            <span className="text-sm text-white/50">ou</span>
            <div className="h-px flex-1 bg-white/30" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              height: 48,
              borderRadius: 14,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
            }}
            className="w-full px-6 text-base text-[#3A6356] bg-white transition-opacity hover:opacity-90 active:opacity-80"
          >
             Como Operador
          </button>
        </div>
      </div>
    </div>
  )
}
