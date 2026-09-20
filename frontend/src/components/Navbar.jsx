import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="navbar" aria-label="Main">
      <Link to="/" className="navbar__title">
        Email agent
      </Link>
      <div className="navbar__actions">
        {isAuthenticated ? (
          <button type="button" className="navbar__button" onClick={logout}>
            Log out
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar__link">
              Log in
            </Link>
            <Link to="/signup" className="navbar__button">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
