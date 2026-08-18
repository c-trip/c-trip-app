import PhoneInputLib from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import pt from 'react-phone-number-input/locale/pt'

type PhoneInputProps = {
  value: string | undefined
  onChange: (value: string | undefined) => void
  defaultCountry?: string
  placeholder?: string
}

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = 'AO',
  placeholder = 'Número de telefone',
}: PhoneInputProps) {
  return (
    <PhoneInputLib
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange}
      labels={pt}
      placeholder={placeholder}
      international
      withCountryCallingCode
    />
  )
}
