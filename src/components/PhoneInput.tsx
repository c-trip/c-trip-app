import { useState, useRef, useEffect, useMemo } from 'react'
import { getCountries, getCountryCallingCode, parsePhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input'
import pt from 'react-phone-number-input/locale/pt'

type PhoneInputProps = {
  value: string | undefined
  onChange: (value: string | undefined) => void
  defaultCountry?: string
  placeholder?: string
}

const FLAGS_URL = 'https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg'

const PATTERNS: Record<string, number[]> = {
  AO: [3, 3, 3],
  MZ: [3, 3, 3],
  CV: [3, 2, 2],
  GW: [3, 3, 3],
  ST: [3, 2, 2],
  BR: [2, 5, 4],
  PT: [3, 3, 3],
  ZA: [3, 3, 4],
  CD: [3, 3, 4],
  US: [3, 3, 4],
  GB: [4, 3, 3],
}

function formatDigits(digits: string, country: string): string {
  const pattern = PATTERNS[country] ?? [3, 3, 3]
  const grouped = []
  let remaining = digits
  for (const len of pattern) {
    if (remaining.length === 0) break
    grouped.push(remaining.slice(0, len))
    remaining = remaining.slice(len)
  }
  if (remaining) grouped.push(remaining)
  return grouped.join(' ')
}

function getMaxLength(country: string): number {
  const code = getCountryCallingCode(country)
  let max = 0
  for (let i = 1; i <= 15; i++) {
    const num = '+' + code + '9'.repeat(i)
    if (isPossiblePhoneNumber(num)) max = i
  }
  return max || 10
}

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = 'AO',
  placeholder = 'Número de telefone',
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const countries = getCountries()
  const callingCode = getCountryCallingCode(selectedCountry)
  const prefix = `+${callingCode}`
  const localNumber = value?.startsWith(prefix) ? value.slice(prefix.length) : ''
  const displayNumber = formatDigits(localNumber, selectedCountry)
  const flagUrl = FLAGS_URL.replace('{XX}', selectedCountry)
  const maxLength = useMemo(() => getMaxLength(selectedCountry), [selectedCountry])

  const parsed = value ? parsePhoneNumber(value) : null
  const formatted = parsed?.formatInternational() || ''
  const isValid = value ? isPossiblePhoneNumber(value) : false
  const isComplete = localNumber.length === maxLength
  const isError = localNumber.length > 0 && localNumber.length >= maxLength && !isValid

  const filtered = countries.filter((c) => {
    const label = pt[c] || c
    const code = `+${getCountryCallingCode(c)}`
    const query = search.toLowerCase()
    return label.toLowerCase().includes(query) || code.includes(query) || c.toLowerCase().includes(query)
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(country: string) {
    setSelectedCountry(country)
    setOpen(false)
    setSearch('')
    const local = value?.startsWith(prefix) ? value.slice(prefix.length) : ''
    const newNumber = `+${getCountryCallingCode(country)}${local}`
    onChange(newNumber || undefined)
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    if (!digits) {
      onChange(undefined)
      return
    }
    if (digits.length > maxLength) return
    onChange(`+${getCountryCallingCode(selectedCountry)}${digits}`)
  }

  const borderColor = isError
    ? 'border-red-400'
    : isComplete
      ? 'border-green-500'
      : 'border-gray-300'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex w-full gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50 px-3 h-12 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <img
              src={flagUrl}
              alt={selectedCountry}
              className="w-5 h-auto rounded-sm"
            />
            <span>+{callingCode}</span>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute z-50 mt-1 w-64 max-h-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Procurar país..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
                  autoFocus
                />
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {filtered.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        c === selectedCountry ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <img
                        src={FLAGS_URL.replace('{XX}', c)}
                        alt={c}
                        className="w-5 h-auto rounded-sm"
                      />
                      <span className="flex-1 text-left">{pt[c] || c}</span>
                      <span className="text-gray-400 text-xs">+{getCountryCallingCode(c)}</span>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="px-3 py-4 text-sm text-gray-400 text-center">Nenhum país encontrado</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 relative">
          <input
            type="tel"
            inputMode="numeric"
            value={displayNumber}
            onChange={handleNumberChange}
            placeholder={placeholder}
            className={`w-full rounded-xl border ${borderColor} bg-gray-50 px-4 h-12 pr-16 text-sm font-outfit text-gray-800 outline-none transition-colors ${
              isError ? 'focus:border-red-500' : 'focus:border-green-500'
            }`}
          />
          {localNumber.length > 0 && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${
              isError ? 'text-red-400' : isComplete ? 'text-green-500' : 'text-gray-400'
            }`}>
              {localNumber.length}/{maxLength}
            </span>
          )}
        </div>
      </div>

      {formatted && localNumber.length > 0 && (
        <p className="text-xs text-gray-400 font-outfit ml-0.5">{formatted}</p>
      )}

      {isError && (
        <p className="text-xs text-red-400 font-outfit ml-0.5">
          Número inválido para {pt[selectedCountry]}
        </p>
      )}
    </div>
  )
}
