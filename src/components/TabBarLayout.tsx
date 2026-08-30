import { Outlet } from 'react-router'
import BottomTabBar from './BottomTabBar'

export default function TabBarLayout() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 ">
      <Outlet />
      <BottomTabBar />
    </div>
  )
}
