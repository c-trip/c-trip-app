import { Outlet, Navigate } from 'react-router'
import OperatorBottomTabBar from './OperatorBottomTabBar'

function hasOperatorSession(): boolean {
  try {
    const raw = sessionStorage.getItem('operatorSession')
    return !!raw && JSON.parse(raw)?.operatorCode
  } catch {
    return false
  }
}

export default function OperatorTabBarLayout() {
  if (!hasOperatorSession()) {
    return <Navigate to="/operator/login" replace />
  }

  return (
    <div className="pb-24">
      <Outlet />
      <OperatorBottomTabBar />
    </div>
  )
}
