import { useAuth0 } from '@auth0/auth0-react'

function Navbar() {

  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user
  } = useAuth0()

  return (

    <nav className="navbar navbar-expand-lg navbar-dark medieval-navbar">

      <div className="container">

        <span className="navbar-brand medieval-title">
          Libro Digital
        </span>

        <div className="d-flex align-items-center gap-3">

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