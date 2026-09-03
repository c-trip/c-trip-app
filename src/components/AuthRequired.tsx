import { Link, useNavigate } from 'react-router'
import { IconLock } from '@tabler/icons-react'
import GradientButton from './GradientButton'

interface AuthRequiredProps {
  /** Caminho a que o utilizador tentou aceder, para regressar após iniciar sessão. */
  from: string
  /** Mensagem opcional a explicar porque é necessária a sessão. */
  message?: string
  /** Para onde ir quando o utilizador escolhe continuar sem conta. */
  fallbackTo?: string
}

export default function AuthRequired({
  from,
  message = 'Esta secção é pessoal. Inicie sessão para ver os seus bilhetes, reservas, notificações e perfil.',
  fallbackTo = '/search',
}: AuthRequiredProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-[70vh] bg-[#F9FAFB] font-outfit flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center">
          <IconLock className="size-7 text-[#1B7A3D]" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-[#111827]">Inicie sessão para continuar</h1>
          <p className="text-sm text-[#4B5563] leading-relaxed">{message}</p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <GradientButton
            onClick={() => navigate('/auth/login', { state: { from } })}
          >
            Iniciar sessão
          </GradientButton>

          <button
            type="button"
            onClick={() => navigate(fallbackTo, { replace: true })}
            className="w-full h-12 rounded-xl border border-gray-200 bg-white text-base
             font-semibold text-[#4B5563] transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            Agora não
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Não tem conta?{' '}
          <Link
            to="/auth/register"
            state={{ from }}
            className="text-[#3A6356] font-semibold underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
