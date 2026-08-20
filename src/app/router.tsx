import { Navigate, Route, Routes } from 'react-router'

import WelcomePage from '../routes/_public/WelcomePage'
import SearchPage from '../routes/_public/SearchPage'
import ResultsPage from '../routes/_public/ResultsPage'
import SchedulePage from '../routes/_public/SchedulePage'

import LoginPage from '../routes/_auth/LoginPage'
import RegisterPage from '../routes/_auth/RegisterPage'
import RegisterCompanyPage from '../routes/_auth/RegisterCompanyPage'

import CheckoutPage from '../routes/_passenger/CheckoutPage'
import PaymentPage from '../routes/_passenger/PaymentPage'
import TicketPage from '../routes/_passenger/TicketPage'
import BookingsPage from '../routes/_passenger/BookingsPage'
import BookingDetailPage from '../routes/_passenger/BookingDetailPage'
import ProfilePage from '../routes/_passenger/ProfilePage'
import NotificationsPage from '../routes/_passenger/NotificationsPage'
import TicketsPage from '../routes/_passenger/TicketsPage'

import GestorDashboard from '../routes/_gestor/GestorDashboard'
import GestorRoutes from '../routes/_gestor/GestorRoutes'
import GestorSchedules from '../routes/_gestor/GestorSchedules'
import GestorFleet from '../routes/_gestor/GestorFleet'
import GestorTeam from '../routes/_gestor/GestorTeam'
import GestorPayments from '../routes/_gestor/GestorPayments'

import OperatorDayTrips from '../routes/_operator/OperatorDayTrips'
import OperatorWalkIn from '../routes/_operator/OperatorWalkIn'
import OperatorReprint from '../routes/_operator/OperatorReprint'
import OperatorScan from '../routes/_operator/OperatorScan'
import OperatorManifest from '../routes/_operator/OperatorManifest'
import OperatorTasks from '../routes/_operator/OperatorTasks'

import OperatorsPage from '../routes/_public/OperatorsPage'

import TabBarLayout from '../components/TabBarLayout'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      <Route path="/welcome" element={<WelcomePage />} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/register/company" element={<RegisterCompanyPage />} />

      <Route element={<TabBarLayout />}>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/results" element={<ResultsPage />} />
        <Route path="/schedules/:scheduleId" element={<SchedulePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:bookingId" element={<BookingDetailPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/checkout/:scheduleId" element={<CheckoutPage />} />
      <Route path="/payment/:bookingId" element={<PaymentPage />} />
      <Route path="/ticket/:bookingId" element={<TicketPage />} />
      <Route path="/search-results/:origin" element={<OperatorsPage />} />
      <Route path="/search-results/:origin/:destination" element={<OperatorsPage />} />

      <Route path="/gestor" element={<GestorDashboard />} />
      <Route path="/gestor/routes" element={<GestorRoutes />} />
      <Route path="/gestor/schedules" element={<GestorSchedules />} />
      <Route path="/gestor/fleet" element={<GestorFleet />} />
      <Route path="/gestor/team" element={<GestorTeam />} />
      <Route path="/gestor/payments" element={<GestorPayments />} />

      <Route path="/operator" element={<OperatorDayTrips />} />
      <Route path="/operator/scan" element={<OperatorScan />} />
      <Route path="/operator/walkin" element={<OperatorWalkIn />} />
      <Route path="/operator/reprint" element={<OperatorReprint />} />
      <Route path="/operator/manifest" element={<OperatorManifest />} />
      <Route path="/operator/tasks" element={<OperatorTasks />} />

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}
