import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'
import { Link } from 'react-router-dom'

import './Nav.css'

export const Nav = () => {
  const { isAuthenticated, user } = useAuth0()

  return (
    <nav>
      { !isAuthenticated && <LoginButton /> }
      { isAuthenticated && <Profile user={user} /> }
      <div>
        <div>
          <Link to="/play/offline" >Play Offline</Link>
          <Link to="/play/online" >Play Online</Link>
        </div>
        <div>
          <Link to="/games">My Games</Link>
        </div>
      </div>
    </nav>
  )
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()
  return <button onClick={() => loginWithRedirect()}>Log In</button>
}

const LogoutButton = () => {
  const { logout } = useAuth0()
  return <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
}

const Profile = ({ user }) => {
  return (
    <div className="profile">
      <img src={user.picture} alt={user.name} />
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <LogoutButton />
      </div>
    </div>
  )
}
