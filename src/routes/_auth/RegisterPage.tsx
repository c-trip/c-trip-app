import { useState } from 'react'
import { Link } from 'react-router'
import PhoneInput from '../../components/PhoneInput'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState<string | undefined>()

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 overflow-hidden font-outfit">
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <header className="relative z-10 w-full max-w-sm text-center flex flex-col items-center
         justify-center gap-8 ">
          <div className="w-16 h-16 bg-[#1B7A3D] rounded-full"></div>
          <div className="flex flex-col items-center justify-center gap-2">
           <h1 className="text-3xl font-bold font-outfit">C-trip Angola</h1>
           <p className="text-[#4B5563] text-sm">Crie a sua conta gratuita</p>
          </div>
        </header>
        <section className="w-full max-w-sm text-left mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-outfit">
            Nome completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Introduza o seu nome"
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 h-12
             text-sm font-outfit text-gray-800 outline-none transition-colors
             focus:border-green-500"
          />

          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4 font-outfit">
            Número de telefone
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            defaultCountry="AO"
            placeholder="Número de telefone"
          />

          <button
            type="button"
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
            Criar conta
          </button>

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
          Já tem conta?{' '}
          <Link to="/auth/login" className="text-[#3A6356] font-semibold underline">
            Entrar
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
