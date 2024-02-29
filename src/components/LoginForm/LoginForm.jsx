import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  return (
    <Grid component='form' direction='column' autoComplete="off" alignItems="center" justifyContent="center" container spacing={2} onSubmit={login} >
      <Grid item textAlign='center' xs={4}>
        <Typography
          variant="h5"
          noWrap
          sx={{
            fontWeight: 900,
          }}
          color='primary'
          textAlign='center'
        >Farkle (Gus's Version)</Typography>
        <Typography variant='h5'>Login</Typography>
        {errors.loginMessage && (
          <Typography variant='h6' className="alert" role="alert">
            {errors.loginMessage}
          </Typography>
        )}
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth label='Username' variant="outlined"
          type="text"
          name="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth label='Password'
          variant="outlined"
          type="password"
          name="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <Button variant='contained'
          className="btn"
          type="submit"
          name="submit"
          value="Log In"
          sx={{ m: 0.5 }}
        >
          Log In
        </Button>

        <Button
          variant='contained'
          color='secondary'
          type="button"
          className="btn btn_asLink"
          sx={{ m: 0.5 }}
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </Button>
      </Grid>
    </Grid>
  );
}

export default LoginForm;
