import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Navbar from './components/layout/Navbar'

import HomePage from './pages/HomePage'
import AdminDashboard from './pages/admin/AdminDashboard'
import CursosPage from './pages/admin/CursosPage'
import AsignaturasPage from './pages/admin/AsignaturasPage'
import PeriodosPage from './pages/admin/PeriodosPage'
import AsignacionesDocentesPage from './pages/admin/AsignacionesDocentesPage'
import EstudiantesPage from './pages/admin/EstudiantesPage'
import UsuariosPage from './pages/admin/UsuariosPage'
import RankingPage from './pages/docente/RankingPage'
import MensajeriaPage from './pages/docente/MensajeriaPage'
import DocenteDashboard from './pages/docente/DocenteDashboard'
import UsuarioDashboard from './pages/usuario/UsuarioDashboard'

import ProtectedRoute from './auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cursos"
          element={
            <ProtectedRoute requiredRole="admin">
              <CursosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/asignaturas"
          element={
            <ProtectedRoute requiredRole="admin">
              <AsignaturasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/periodos"
          element={
            <ProtectedRoute requiredRole="admin">
              <PeriodosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/asignaciones-docentes"
          element={
            <ProtectedRoute requiredRole="admin">
              <AsignacionesDocentesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/estudiantes"
          element={
            <ProtectedRoute requiredRole="admin">
              <EstudiantesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsuariosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docente"
          element={
            <ProtectedRoute requiredRole="docente">
              <DocenteDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docente/ranking"
          element={
            <ProtectedRoute requiredRole="docente">
              <RankingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docente/mensajeria"
          element={
            <ProtectedRoute requiredRole="docente">
              <MensajeriaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuario"
          element={
            <ProtectedRoute requiredRole="estudiante">
              <UsuarioDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App