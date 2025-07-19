import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

/**
 * Route protection components using React Router's Outlet pattern
 * ProtectedRoutes: Requires authentication to access child routes
 * UnauthorizedRoutes: Redirects authenticated users away from auth pages
 */
const ProtectedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) return <Navigate to="/dashboard" replace={true} />
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />

      <Route element={<UnauthorizedRoutes />}>
        <Route path='/login' element={<Login />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
