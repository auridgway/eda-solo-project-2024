import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Nav from '../Nav/Nav';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import './App.css';
import DashboardScreen from '../DashboardScreen/DashboardScreen';
import GameplayScreen from '../GameplayScreen/GameplayScreen';
import Multiplayer from '../Multiplayer/Multiplayer';
import NewGame from '../NewGame/NewGame';
import WaitingRoom from '../WaitingRoom/WaitingRoom';



function App() {
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        {!user.id ? <></> : <Nav />}

        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:5173/about will show the about page. */}
          <ProtectedRoute
            // shows AboutPage at all times (logged in or not)
            exact
            path="/multiplayer"
          >
            <Multiplayer />
          </ProtectedRoute>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
          <ProtectedRoute
            // This will show logged in user the dashboard screen
            exact
            path="/dashboard"
          >
            <DashboardScreen />
          </ProtectedRoute>

          <ProtectedRoute
            // This will show logged in user the gameplayscreen
            exact
            path="/game/:gameid"
          >
            <GameplayScreen />
          </ProtectedRoute>

          <ProtectedRoute
            // This will show logged in user the gameplayscreen
            exact
            path="/waiting/:gameid"
          >
            <WaitingRoom />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows InfoPage else shows LoginPage
            exact
            path="/create"
          >
            <NewGame />
          </ProtectedRoute>

          <Route
            exact
            path="/login"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect to the /dashboard page
              <Redirect to="/dashboard" />
              :
              // Otherwise, show the login page
              <LoginPage />
            }
          </Route>

          <Route
            exact
            path="/registration"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect them to the /dashboard page
              <Redirect to="/dashboard" />
              :
              // Otherwise, show the registration page
              <RegisterPage />
            }
          </Route>

          <Route
            exact
            path="/home"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect them to the /dashboard page
              <Redirect to="/dashboard" />
              :
              // Otherwise, show the Landing page
              <LoginPage />
            }
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
