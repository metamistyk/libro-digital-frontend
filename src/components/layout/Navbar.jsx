import { Link } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'

function Navbar() {

    const {
        loginWithRedirect,
        logout,
        isAuthenticated,
        user
    } = useAuth0()

    const roles =
        user?.['https://libro-digital-api/roles'] || []

    return (

        <nav className="navbar navbar-expand-lg navbar-dark medieval-navbar">

            <div className="container">

                <Link
                    to="/"
                    className="navbar-brand medieval-title text-decoration-none"
                >
                    Libro Digital
                </Link>

                <div className="d-flex align-items-center gap-3">

                    {
                        isAuthenticated && roles.includes('admin') && (
                            <>
                                <Link
                                    to="/admin"
                                    className="btn medieval-btn"
                                >
                                    Admin
                                </Link>

                                <Link
                                    to="/admin/cursos"
                                    className="btn medieval-btn"
                                >
                                    Cursos
                                </Link>

                                <Link
                                    to="/admin/asignaturas"
                                    className="btn medieval-btn"
                                >
                                    Asignaturas
                                </Link>

                                <Link
                                    to="/admin/periodos"
                                    className="btn medieval-btn"
                                >
                                    Periodos
                                </Link>

                                <Link
                                    to="/admin/asignaciones-docentes"
                                    className="btn medieval-btn"
                                >
                                    Asignaciones
                                </Link>

                                <Link
                                    to="/admin/usuarios"
                                    className="btn medieval-btn"
                                >
                                    Usuarios
                                </Link>

                                <Link
                                    to="/admin/estudiantes"
                                    className="btn medieval-btn"
                                >
                                    Estudiantes
                                </Link>
                            </>
                        )
                    }

                    {
                        isAuthenticated && roles.includes('docente') && (
                            <Link
                                to="/docente"
                                className="btn medieval-btn"
                            >
                                Portal Docente
                            </Link>
                        )
                    }

                    {
                        isAuthenticated && roles.includes('estudiante') && (
                            <Link
                                to="/usuario"
                                className="btn medieval-btn"
                            >
                                Portal Usuario
                            </Link>
                        )
                    }

                    {
                        isAuthenticated && (
                            <span className="text-light">
                                {user?.name}
                            </span>
                        )
                    }

                    {
                        !isAuthenticated ? (
                            <button
                                className="btn medieval-btn"
                                onClick={() => loginWithRedirect()}
                            >
                                Iniciar Sesión
                            </button>
                        ) : (
                            <button
                                className="btn medieval-btn"
                                onClick={() =>
                                    logout({
                                        logoutParams: {
                                            returnTo: window.location.origin
                                        }
                                    })
                                }
                            >
                                Cerrar Sesión
                            </button>
                        )
                    }

                </div>

            </div>

        </nav>
    )
}

export default Navbar