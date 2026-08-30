import { Navigate, Route, Routes } from 'react-router'

import WelcomePage from '../routes/_public/WelcomePage'
import SearchPage from '../routes/_public/SearchPage'
import ResultsPage from '../routes/_public/ResultsPage'
import SchedulePage from '../routes/_public/SchedulePage'
import HoldPage from '../routes/_public/HoldPage'

import LoginPage from '../routes/_auth/LoginPage'
import RegisterPage from '../routes/_auth/RegisterPage'

import CheckoutPage from '../routes/_passenger/CheckoutPage'
import PaymentPage from '../routes/_passenger/PaymentPage'
import TicketPage from '../routes/_passenger/TicketPage'
import TicketQrPage from '../routes/_passenger/TicketQrPage'
import BookingsPage from '../routes/_passenger/BookingsPage'
import BookingDetailPage from '../routes/_passenger/BookingDetailPage'
import ProfilePage from '../routes/_passenger/ProfilePage'
import NotificationsPage from '../routes/_passenger/NotificationsPage'
import TicketsPage from '../routes/_passenger/TicketsPage'



import OperatorLoginPage from '../routes/_operator/OperatorLoginPage'
import OperatorDayTrips from '../routes/_operator/OperatorDayTrips'
import OperatorWalkIn from '../routes/_operator/OperatorWalkIn'
import OperatorReprint from '../routes/_operator/OperatorReprint'
import OperatorScan from '../routes/_operator/OperatorScan'
import ScanResultSuccess from '../routes/_operator/ScanResultSuccess'
import OperatorManifest from '../routes/_operator/OperatorManifest'
import OperatorTasks from '../routes/_operator/OperatorTasks'
import OperatorCalendarPage from '../routes/_operator/OperatorCalendarPage'

import OperatorsPage from '../routes/_public/OperatorsPage'

import TabBarLayout from '../components/TabBarLayout'
import OperatorTabBarLayout from '../components/OperatorTabBarLayout'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      <Route path="/welcome" element={<WelcomePage />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      <Route element={<TabBarLayout />}>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/search/results" element={<ResultsPage />} />
      <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />

      <Route path="/schedules/:scheduleId" element={<SchedulePage />} />
      <Route path="/hold/:scheduleId/:routeSlug/:companySlug" element={<HoldPage />} />

      <Route path="/checkout/:scheduleId" element={<CheckoutPage />} />
      <Route path="/ticket-qr/:scheduleId" element={<TicketQrPage />} />
      <Route path="/payment/:bookingId" element={<PaymentPage />} />
      <Route path="/ticket/:bookingId" element={<TicketPage />} />
      <Route path="/search-results/:origin" element={<OperatorsPage />} />
      <Route path="/search-results/:origin/:destination" element={<OperatorsPage />} />

      

      <Route path="/operator/login" element={<OperatorLoginPage />} />
      <Route element={<OperatorTabBarLayout />}>
        <Route path="/operator" element={<OperatorDayTrips />} />
        <Route path="/operator/walkin" element={<OperatorWalkIn />} />
        <Route path="/operator/reprint" element={<OperatorReprint />} />
        <Route path="/operator/tasks" element={<OperatorTasks />} />
        <Route path="/operator/calendar" element={<OperatorCalendarPage />} />
      </Route>
      <Route path="/operator/manifest" element={<OperatorManifest />} />
      <Route path="/operator/scan" element={<OperatorScan />} />
      <Route path="/operator/scan-result-success" element={<ScanResultSuccess />} />

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}
