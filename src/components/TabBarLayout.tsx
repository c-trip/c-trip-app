import { Outlet } from 'react-router'
import BottomTabBar from './BottomTabBar'

export default function TabBarLayout() {
  return (
    <div className="pb-20 ">
      <Outlet />
      <BottomTabBar />
    </div>
  )
}
