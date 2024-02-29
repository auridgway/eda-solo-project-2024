import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  return (

    <Grid component='form' direction='column' autoComplete="off" alignItems="center" justifyContent="center" container spacing={2} onSubmit={registerUser} >
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
        <Typography variant='h5'>Register User</Typography>
        {errors.registrationMessage && (
          <Typography color='warning' className="alert" role="alert">
            {errors.registrationMessage}
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
          value="Register"
          sx={{ m: 0.5 }}
        >
          Register
        </Button>
        <Button variant='contained'
          color='secondary'
          sx={{ m: 0.5 }}
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
}

export default RegisterForm;
