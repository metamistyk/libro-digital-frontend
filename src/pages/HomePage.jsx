import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

function HomePage() {

    const {
        isAuthenticated,
        user
    } = useAuth0()

    const roles = user?.['https://libro-digital-api/roles'] || []

    return (
        <div className="container py-5">

            <div className="medieval-card">

                <h1 className="mb-4">
                    Plataforma Libro Digital
                </h1>

                <p>
                    Sistema académico con microservicios, seguridad Auth0 y estilo medieval literario.
                </p>

                {
                    !isAuthenticated && (
                        <p className="mt-4">
                            Inicia sesión para acceder a tu portal.
                        </p>
                    )
                }

                {
                    isAuthenticated && (
                        <div className="d-flex gap-3 flex-wrap mt-4">

                            {
                                roles.includes('admin') && (
                                    <Link to="/admin" className="btn medieval-btn">
                                        Panel Administrativo
                                    </Link>
                                )
                            }

                            {
                                roles.includes('docente') && (
                                    <Link to="/docente" className="btn medieval-btn">
                                        Portal Docente
                                    </Link>
                                )
                            }

                            {
                                roles.includes('estudiante') && (
                                    <Link to="/usuario" className="btn medieval-btn">
                                        Portal Estudiante
                                    </Link>
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default HomePage