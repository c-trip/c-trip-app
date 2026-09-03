import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  IconUser,
  IconMail,
  IconShieldLock,
  IconLock,
  IconLogout,
  IconChevronRight,
  IconRefresh,
  IconCheck,
} from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/auth/useAuth'
import { useChangePassword } from '@/hooks/auth/useChangePassword'
import { useMyPermissions } from '@/hooks/auth/useMyPermissions'

function formatRole(role?: string): string {
  if (!role) return '—'
  return role
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function OperatorProfile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user, isLoading, error } = useProfile()
  const permissions = useMyPermissions()
  const { submit: submitPassword, loading: changingPassword } = useChangePassword()

  const [pwOpen, setPwOpen] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [logoutOpen, setLogoutOpen] = useState(false)

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

  const handleLogout = () => {
    logout()
    navigate('/operator/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-40 bg-white px-5 pt-4 pb-4 border-b border-gray-200">
        <h1 className="text-[22px] font-bold text-[#111827]">Perfil</h1>
        <p className="text-sm text-gray-500">Conta do operador</p>
      </header>

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
              onClick={() => navigate('/operator/login')}
              className="rounded-xl bg-[#1B7A3D] px-6 py-3 text-sm font-semibold text-white"
            >
              Iniciar sessão
            </button>
          </div>
        )}

        {user && (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#1B7A3D]/10">
                <IconUser className="h-10 w-10 text-[#1B7A3D]" />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">{user.name}</h2>
              <span className="mt-1 rounded-full bg-[#1B7A3D]/10 px-3 py-0.5 text-[11px] font-semibold text-[#1B7A3D]">
                {formatRole(user.role)}
              </span>
            </div>

            <div className="mb-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
                <IconMail className="size-5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-[#111827] truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
                <IconShieldLock className="size-5 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Perfil</p>
                  <p className="text-sm font-semibold text-[#111827]">{formatRole(user.role)}</p>
                </div>
              </div>
            </div>

            <section className="mb-6">
              <p className="mb-2 text-xs font-bold text-[#6B7280] uppercase tracking-wide">Permissões</p>
              {permissions.isLoading && (
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-gray-100" />
                  ))}
                </div>
              )}
              {!permissions.isLoading && permissions.error && (
                <button
                  type="button"
                  onClick={() => void permissions.refetch()}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
                >
                  <IconRefresh className="size-4" />
                  {permissions.error} — tentar novamente
                </button>
              )}
              {!permissions.isLoading && !permissions.error && (
                (permissions.data?.permissions.length ?? 0) === 0 ? (
                  <p className="text-sm text-gray-400">Sem permissões atribuídas.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {permissions.data!.permissions.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[11px] font-medium text-[#4B5563]"
                      >
                        <IconCheck className="size-3 text-[#1B7A3D]" />
                        {p}
                      </span>
                    ))}
                  </div>
                )
              )}
            </section>

            {pwOpen && (
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
            )}

            <Card className="border-[#E5E7EB]">
              <CardContent className="p-0 divide-y divide-gray-100">
                <button
                  onClick={() => setPwOpen((v) => !v)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <IconLock className="size-5 text-gray-400" />
                  <span className="flex-1 text-sm font-medium text-[#111827]">Alterar palavra-passe</span>
                  <IconChevronRight className="size-4 text-gray-300" />
                </button>

                <button
                  onClick={() => setLogoutOpen(true)}
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

      {logoutOpen && (
        <ConfirmDialog
          title="Terminar sessão"
          message="Tem a certeza que quer terminar a sessão nesta conta de operador?"
          confirmLabel="Terminar"
          cancelLabel="Cancelar"
          destructive
          onConfirm={handleLogout}
          onClose={() => setLogoutOpen(false)}
        />
      )}
    </div>
  )
}
