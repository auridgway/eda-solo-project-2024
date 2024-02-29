import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 900,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Farkle (Gus's Version)
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {user.id && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography onClick={() => {
                    history.push('/dashboard');
                    handleCloseNavMenu();
                  }} textAlign="center">Home</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography onClick={() => {
                    history.push('/create');
                    handleCloseNavMenu();
                  }} textAlign="center">New Game</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography onClick={() => {
                    history.push('/multiplayer');
                    handleCloseNavMenu();
                  }} textAlign="center">Multiplayer</Typography>
                </MenuItem>
              </Menu>
            )}
            {!user.id && (
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography onClick={() => {
                    history.push('/login');
                    handleCloseNavMenu();
                  }} textAlign="center">Login / Register</Typography>
                </MenuItem>
              </Menu>
            )}
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 900,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Farkle (Gus's Version)
          </Typography>
          {user.id && (

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => {
                  history.push('/dashboard');
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>
              <Button
                onClick={() => {
                  history.push('/create');
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                New Game
              </Button>
              <Button
                onClick={() => {
                  history.push('/multiplayer');
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Multiplayer
              </Button>
            </Box>
          )}
          {!user.id && (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => {
                  history.push('/login');
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Login / Register
              </Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Typography>Welcome: {user.username}</Typography>
            <Typography>ID: {user.id}</Typography>
            <LogOutButton />
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              <MenuItem onClick={() => {
                history.push('/login');
                handleCloseUserMenu();
              }}>
                <Typography textAlign="center">Log Out</Typography>
              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )

  // return (
  //   <div className="nav">
  //     <Link to="/home">
  //       <h2 className="nav-title">Farkle (Gus's Version)</h2>
  //     </Link>
  //     <div>
  //       {/* If no user is logged in, show these links */}
  //       {!user.id && (
  //         // If there's no user, show login/registration links
  //         <Link className="navLink" to="/login">
  //           Login / Register
  //         </Link>
  //       )}

  //       {/* If a user is logged in, show these links */}
  //       {user.id && (
  //         <>
  //           <pre>Welcome, {user.username}!</pre>
  //           <pre>Your ID is: {user.id}</pre>
  //           <Link className="navLink" to="/dashboard">
  //             Home
  //           </Link>

  //           <Link className="navLink" to="/create">
  //             New Game
  //           </Link>

  //           <Link className="navLink" to="/multiplayer">
  //             Multiplayer
  //           </Link>

  //           <LogOutButton className="navLink" />
  //         </>
  //       )}
  //     </div>
  //   </div>
  // );
}

export default Nav;
