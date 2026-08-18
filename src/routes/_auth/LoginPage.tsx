import { useState } from 'react'
import PhoneInput from '../../components/PhoneInput'

export default function LoginPage() {
  const [phone, setPhone] = useState<string | undefined>()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center
     px-6 overflow-hidden font-outfit">
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
          Introduza o seu número de telefone
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
        Continuar com Telefone
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
    </div>
  )
}
