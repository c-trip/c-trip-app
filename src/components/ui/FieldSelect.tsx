import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconChevronDown, IconCheck } from '@tabler/icons-react'

interface FieldSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const MENU_MAX_HEIGHT = 260

/** Select customizado — dropdown flutuante (portal) ancorado ao botão. */
export default function FieldSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Qualquer',
  disabled = false,
  isOpen,
  onOpenChange,
}: FieldSelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const open = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect())
    onOpenChange(true)
  }

  useEffect(() => {
    if (!isOpen) return

    const reposition = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect())
    }
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      onOpenChange(false)
    }

    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [isOpen, onOpenChange])

  const items = [{ label: placeholder, value: '' }, ...options.map((o) => ({ label: o, value: o }))]

  const openUp =
    !!rect && rect.bottom + MENU_MAX_HEIGHT > window.innerHeight && rect.top > MENU_MAX_HEIGHT

  return (
    <div>
      <span className="mb-1.5 block text-xs font-bold text-[#6B7280] uppercase tracking-wide">{label}</span>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? onOpenChange(false) : open())}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-gray-50 px-3 text-sm outline-none transition-colors disabled:opacity-50 ${
          isOpen ? 'border-[#1B7A3D]' : 'border-gray-200'
        } ${value ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <IconChevronDown
          className={`size-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && rect &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              left: rect.left,
              width: rect.width,
              zIndex: 60,
              ...(openUp
                ? { bottom: window.innerHeight - rect.top + 6 }
                : { top: rect.bottom + 6 }),
            }}
            className="max-h-[260px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 font-outfit shadow-xl animate-dropdown-in"
          >
            {items.map((item) => {
              const selected = item.value === value
              return (
                <li key={item.value || '__any'}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(item.value)
                      onOpenChange(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selected
                        ? 'bg-[#1B7A3D]/10 font-semibold text-[#1B7A3D]'
                        : 'text-[#111827] hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    {selected && <IconCheck className="size-4 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>,
          document.body,
        )}
    </div>
  )
}
