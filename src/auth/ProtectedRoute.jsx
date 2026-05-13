import { Navigate } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'

function ProtectedRoute({
    children,
    requiredRole
}) {

    const {
        isAuthenticated,
        user
    } = useAuth0()

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