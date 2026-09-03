import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * Modal de confirmação centrado. Renderizar condicionalmente pelo pai
 * (`{open && <ConfirmDialog .../>}`).
 */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, loading])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 font-outfit"
      onClick={() => !loading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-scale-in"
      >
        <h2 className="text-base font-bold text-[#111827]">{title}</h2>
        <div className="mt-2 text-sm text-[#4B5563] leading-relaxed">{message}</div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-11 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#4B5563] transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-11 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 ${
              destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1B7A3D] hover:bg-[#15632F]'
            }`}
          >
            {loading ? 'A processar...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
