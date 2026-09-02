import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  IconUser,
  IconBell,
  IconLogout,
  IconChevronRight,
  IconMail,
  IconPencil,
  IconPhone,
  IconId,
  IconLock,
  IconCreditCard,
} from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { Card, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/auth/useAuth'
import { useChangePassword } from '@/hooks/auth/useChangePassword'
import { usePassengerProfile, useUpdateProfile } from '@/hooks/passenger/usePassenger'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user, isLoading, error } = useProfile()
  const { data: passengerProfile } = usePassengerProfile(user?.id)
  const { updateProfile, isLoading: saving } = useUpdateProfile()
  const { submit: submitPassword, loading: changingPassword } = useChangePassword()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [idDocument, setIdDocument] = useState('')

  const [pwOpen, setPwOpen] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')

  const handleChangePassword = async () => {
    if (newPw.length < 6) {
      gooeyToast.error('Palavra-passe muito curta', { description: 'Mínimo 6 caracteres.' })
      return
    }
    const ok = await submitPassword(currentPw, newPw)
    if (ok) {
      gooeyToast.success('Palavra-passe alterada')
      setPwOpen(false)
      setCurrentPw('')
      setNewPw('')
    } else {
      gooeyToast.error('Não foi possível alterar', { description: 'Verifique a palavra-passe actual.' })
    }
  }

  const startEditing = () => {
    setName(user?.name ?? '')
    setPhone('')
    setIdDocument('')
    setEditing(true)
  }

  const handleSave = async () => {
    const res = await updateProfile({
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      id_document: idDocument.trim() || undefined,
    })
    if (res) {
      gooeyToast.success('Perfil actualizado')
      setEditing(false)
      setPhone('')
      setIdDocument('')
    } else {
      gooeyToast.error('Não foi possível guardar', { description: 'Tente novamente.' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader title="Perfil" />

      <main className="px-5 py-6 pb-28">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-gray-500">A carregar perfil...</p>
          </div>
        )}

        {error && !user && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="rounded-xl bg-[#3A6356] px-6 py-3 text-sm font-semibold text-white"
            >
              Iniciar sessão
            </button>
          </div>
        )}

        {user && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#6B9E8C]/20">
                <IconUser className="h-10 w-10 text-[#3A6356]" />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              {passengerProfile?.created_at && (
                <p className="mt-1 text-[11px] text-gray-400">
                  Membro desde {new Date(passengerProfile.created_at).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">Dados pessoais</p>
                {!editing && (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1B7A3D]"
                  >
                    <IconPencil className="size-3.5" />
                    Editar
                  </button>
                )}
              </div>

              {editing ? (
                <div className="flex flex-col gap-3 rounded-xl bg-white p-4 border border-gray-200">
                  <div className="relative">
                    <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 h-11 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="relative">
                    <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefone"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 h-11 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="relative">
                    <IconId className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      value={idDocument}
                      onChange={(e) => setIdDocument(e.target.value)}
                      placeholder="Documento de identificação"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 h-11 text-sm outline-none focus:border-green-500"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Telefone e documento não são mostrados de volta pela API — deixe em branco para não alterar.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 h-10 rounded-lg bg-[#1B7A3D] text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {saving ? 'A guardar...' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 h-10 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-[#4B5563]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
                  <IconMail className="size-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 font-medium">Email</p>
                    <p className="text-sm font-semibold text-[#111827]">{user.email}</p>
                  </div>
                </div>
              )}
            </div>

            {pwOpen ? (
              <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 border border-gray-200">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">Alterar palavra-passe</p>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Palavra-passe actual"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 h-11 text-sm outline-none focus:border-green-500"
                />
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Nova palavra-passe"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 h-11 text-sm outline-none focus:border-green-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword || !currentPw || !newPw}
                    className="flex-1 h-10 rounded-lg bg-[#1B7A3D] text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {changingPassword ? 'A alterar...' : 'Alterar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPwOpen(false); setCurrentPw(''); setNewPw('') }}
                    className="flex-1 h-10 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-[#4B5563]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}

            <Card className="border-[#E5E7EB]">
              <CardContent className="p-0 divide-y divide-gray-100">
                <button
                  onClick={() => navigate('/notifications')}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <IconBell className="size-5 text-gray-400" />
                  <span className="flex-1 text-sm font-medium text-[#111827]">Notificações</span>
                  <IconChevronRight className="size-4 text-gray-300" />
                </button>

                <button
                  onClick={() => navigate('/payments')}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <IconCreditCard className="size-5 text-gray-400" />
                  <span className="flex-1 text-sm font-medium text-[#111827]">Meus pagamentos</span>
                  <IconChevronRight className="size-4 text-gray-300" />
                </button>

                <button
                  onClick={() => setPwOpen((v) => !v)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <IconLock className="size-5 text-gray-400" />
                  <span className="flex-1 text-sm font-medium text-[#111827]">Alterar palavra-passe</span>
                  <IconChevronRight className="size-4 text-gray-300" />
                </button>

                <button
                  onClick={() => {
                    logout()
                    navigate('/welcome')
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 transition-colors"
                >
                  <IconLogout className="size-5 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Terminar sessão</span>
                </button>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
