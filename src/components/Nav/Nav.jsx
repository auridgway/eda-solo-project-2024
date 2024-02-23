import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Farkle (Gus's Version)</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <pre>Welcome, {user.username}!</pre>
            <pre>Your ID is: {user.id}</pre>
            <Link className="navLink" to="/dashboard">
              Home
            </Link>

            <Link className="navLink" to="/create">
              New Game
            </Link>
            
            <Link className="navLink" to="/multiplayer">
              Multiplayer
            </Link>

            <LogOutButton className="navLink" />
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
