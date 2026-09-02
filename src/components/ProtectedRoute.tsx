import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/auth/useAuth'
import AuthRequired from './AuthRequired'

export default function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, hasBootstrapped, bootstrap } = useAuth()

  useEffect(() => {
    if (!hasBootstrapped) void bootstrap()
  }, [hasBootstrapped, bootstrap])

  if (!hasBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] font-outfit">
        <p className="text-sm text-gray-500">A carregar...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthRequired from={location.pathname + location.search} />
  }

  return <Outlet />
}