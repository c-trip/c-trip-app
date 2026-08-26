import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IconArrowLeft, IconBus, IconUser, IconPhone, IconId, IconCheck, IconChevronDown } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getOperatorTodaySchedules } from '@/data/mockOperatorSchedules'
import type { OperatorSchedule } from '@/data/mockOperatorSchedules'
import { Card, CardContent } from '@/components/ui/card'

interface WalkInForm {
  name: string
  phone: string
  idDoc: string
  seatNumber: string
}

const EMPTY_FORM: WalkInForm = { name: '', phone: '', idDoc: '', seatNumber: '' }

export default function OperatorWalkIn() {
  const navigate = useNavigate()
  const schedules = getOperatorTodaySchedules().filter((s) => s.status !== 'departed')
  const [selectedSchedule, setSelectedSchedule] = useState<OperatorSchedule | null>(null)
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const [form, setForm] = useState<WalkInForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const setField = (field: keyof WalkInForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const seatNumber = Number(form.seatNumber)
  const isValid =
    form.name.trim().length >= 2 &&
    selectedSchedule !== null &&
    Number.isInteger(seatNumber) &&
    seatNumber >= 1 &&
    seatNumber <= selectedSchedule.totalSeats

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)

    try {
      // Mock — substituir por POST /boarding/operator/sell
      await new Promise((r) => setTimeout(r, 1500))

      gooeyToast.success('Bilhete vendido', {
        description: `${form.name.trim()} — Lugar ${form.seatNumber.trim()}`,
      })
      setSuccess(true)
    } catch {
      gooeyToast.error('Erro ao vender', {
        description: 'Tente novamente.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(EMPTY_FORM)
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit">
        <header className="sticky top-0 z-50 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/operator')}
              aria-label="Voltar ao painel"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <IconArrowLeft className="size-5 text-gray-600" />
            </button>
            <h1 className="text-[22px] font-bold text-[#111827] text-center flex-1">Venda ao Balcão</h1>
          </div>
        </header>

        <main className="px-5 py-12 flex flex-col items-center gap-6">
          <div className="size-20 rounded-full bg-[#1B7A3D] flex items-center justify-center animate-scale-in">
            <IconCheck className="size-10 text-white" strokeWidth={3} />
          </div>
          <div className="text-center">
            <p className="text-[#111827] font-bold text-lg">Bilhete Vendido com Sucesso</p>
            <p className="text-gray-500 text-sm mt-1">{form.name.trim()} — Lugar {form.seatNumber.trim()}</p>
            {selectedSchedule && (
              <p className="text-gray-400 text-xs mt-1">{selectedSchedule.route} · {selectedSchedule.departureTime}</p>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 bg-[#1B7A3D] text-white font-semibold rounded-xl hover:bg-[#15632F] transition-colors"
            >
              Nova Venda
            </button>
            <button
              type="button"
              onClick={() => navigate('/operator')}
              className="w-full py-3 bg-white text-[#111827] border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Voltar ao Painel
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-50 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/operator')}
            aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IconArrowLeft className="size-5 text-gray-600" />
          </button>
          <h1 className="text-[22px] font-bold text-[#111827] text-center flex-1">Venda ao Balcão</h1>
        </div>
      </header>

      <main className="px-5 py-5 pb-28">
        <section className="mb-6">
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">Viagem</label>
          <button
            type="button"
            onClick={() => setShowSchedulePicker(!showSchedulePicker)}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl text-left hover:border-[#1B7A3D] transition-colors"
          >
            {selectedSchedule ? (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center shrink-0">
                  <IconBus className="size-4 text-[#1B7A3D]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{selectedSchedule.route}</p>
                  <p className="text-[11px] text-gray-500">{selectedSchedule.departureTime} · {selectedSchedule.busPlate} · {selectedSchedule.availableSeats} lugares</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <IconBus className="size-4 text-gray-400" />
                </div>
                <span className="text-sm text-gray-400">Selecionar viagem...</span>
              </div>
            )}
            <IconChevronDown className={`size-5 text-gray-400 transition-transform ${showSchedulePicker ? 'rotate-180' : ''}`} />
          </button>

          {showSchedulePicker && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
              {schedules.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSelectedSchedule(s); setShowSchedulePicker(false) }}
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedSchedule?.id === s.id ? 'bg-[#1B7A3D]/5' : ''
                  }`}
                >
                  <div className="size-9 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center shrink-0">
                    <IconBus className="size-4 text-[#1B7A3D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111827]">{s.route}</p>
                    <p className="text-[11px] text-gray-500">{s.departureTime} · {s.busPlate}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#1B7A3D]">{s.availableSeats} disp.</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">Dados do Passageiro</h2>

          <div className="relative">
            <IconUser className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Nome completo"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
            />
          </div>

          <div className="relative">
            <IconPhone className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="Telefone (opcional)"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
            />
          </div>

          <div className="relative">
            <IconId className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={form.idDoc}
              onChange={(e) => setField('idDoc', e.target.value)}
              placeholder="Documento de identificação (opcional)"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">Lugar</label>
            <input
              type="number"
              min={1}
              max={selectedSchedule?.totalSeats ?? 50}
              value={form.seatNumber}
              onChange={(e) => setField('seatNumber', e.target.value)}
              placeholder={`Número do lugar (1-${selectedSchedule?.totalSeats ?? '?'})`}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
            />
          </div>
        </section>

        <section className="mt-6">
          {selectedSchedule && (
            <Card className="mb-4 border-[#E5E7EB]">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Preço</p>
                  <p className="text-[11px] text-gray-500">Pagamento no balcão</p>
                </div>
                <p className="text-lg font-bold text-[#1B7A3D]">{selectedSchedule.price}</p>
              </CardContent>
            </Card>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="w-full py-3.5 bg-[#1B7A3D] text-white font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#15632F] active:scale-[0.98]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                A processar...
              </span>
            ) : (
              'Confirmar Venda'
            )}
          </button>
        </section>
      </main>
    </div>
  )
}
