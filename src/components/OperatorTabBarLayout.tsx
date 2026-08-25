import { Outlet } from 'react-router'
import OperatorBottomTabBar from './OperatorBottomTabBar'

export default function OperatorTabBarLayout() {
  return (
    <div className="pb-20">
      <Outlet />
      <OperatorBottomTabBar />
    </div>
  )
}
