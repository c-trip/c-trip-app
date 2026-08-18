import { useState } from 'react'
import PhoneInput from '../../components/PhoneInput'

export default function LoginPage() {
  const [phone, setPhone] = useState('')

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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Introduza o seu número de telefone
        </label>
        <PhoneInput
          value={phone}
          onChange={setPhone}
          defaultCountry="ao"
          placeholder="Número de telefone"
        />
      </section>
    </div>
  )
}
