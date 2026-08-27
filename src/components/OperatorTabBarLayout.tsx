import { Outlet, Navigate } from 'react-router'
import OperatorBottomTabBar from './OperatorBottomTabBar'

const VALID_CODE = '123456'

function hasOperatorSession(): boolean {
  try {
    const raw = sessionStorage.getItem('operatorSession')
    if (!raw) return false
    const session = JSON.parse(raw)
    return session?.operatorCode === VALID_CODE
  } catch {
    return false
  }
}

export default function OperatorTabBarLayout() {
  if (!hasOperatorSession()) {
    return <Navigate to="/operator/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <Outlet />
      <OperatorBottomTabBar />
    </div>
  )
}
