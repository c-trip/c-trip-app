import { useEffect } from 'react'
import { Outlet, Navigate } from 'react-router'
import { useAuth } from '@/hooks/auth/useAuth'
import OperatorBottomTabBar from './OperatorBottomTabBar'

export default function OperatorTabBarLayout() {
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
    return <Navigate to="/operator/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <Outlet />
      <OperatorBottomTabBar />
    </div>
  )
}
