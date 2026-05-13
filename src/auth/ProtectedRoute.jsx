import { Navigate } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'

function ProtectedRoute({
    children,
    requiredRole
}) {

    const {
        isAuthenticated,
        isLoading,
        user
    } = useAuth0()

    if (isLoading) {

        return (
            <div className="container py-5">

                <div className="medieval-card">

                    <h3>
                        Cargando sesión...
                    </h3>

                </div>

            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    const roles =
        user?.['https://libro-digital-api/roles'] || []

    if (
        requiredRole &&
        !roles.includes(requiredRole)
    ) {
        return <Navigate to="/" />
    }

    return children
}

export default ProtectedRoute