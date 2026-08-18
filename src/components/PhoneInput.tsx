import PhoneInputLib from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

type PhoneInputProps = {
  value: string
  onChange: (value: string) => void
  defaultCountry?: string
  placeholder?: string
}

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = 'ao',
  placeholder = 'Número de telefone',
}: PhoneInputProps) {
  return (
    <PhoneInputLib
      country={defaultCountry}
      value={value}
      onChange={(phone) => onChange(phone)}
      enableSearch
      searchPlaceholder="Procurar país"
      placeholder={placeholder}
      inputProps={{
        required: true,
        inputMode: 'numeric',
      }}
      containerStyle={{ width: '100%' }}
      inputStyle={{
        width: '100%',
        height: 48,
        borderRadius: 14,
        fontFamily: "'Outfit', sans-serif",
        fontSize: 16,
        border: '1px solid #d1d5db',
        paddingLeft: 52,
      }}
      buttonStyle={{
        height: 48,
        border: '1px solid #d1d5db',
        borderRight: 'none',
        borderRadius: '14px 0 0 14px',
        backgroundColor: '#f9fafb',
      }}
      dropdownStyle={{
        fontFamily: "'Outfit', sans-serif",
        borderRadius: 12,
        border: '1px solid #d1d5db',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    />
  )
}
