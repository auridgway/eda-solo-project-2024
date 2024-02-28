import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

export default function NewGame() {
    const history = useHistory();
    const dispatch = useDispatch();
    const games = useSelector(store => store.games)
    const user = useSelector(store => store.user)
    const [lobbyName, setLobbyName] = useState('');

    function handleCreate(e) {
        e.preventDefault();
        const action = { type: 'CREATE_GAME', payload: { lobby_name: lobbyName } }
        dispatch(action);

        const action2 = { type: 'FETCH_GAMES' }
        dispatch(action2);

        history.push(`/dashboard`);

    }


    return (
        <Container>
            <Typography color='primary' variant="h3">Create New Game</Typography>
            <Paper sx={{ p: 1, m: 1 }}>
                <Grid component='form' direction='row' autoComplete="off" alignItems="center" justifyContent="center" container spacing={2}>
                    <Grid item xs={6} textAlign="center">
                        <TextField fullWidth label='Lobby Name' variant="outlined" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} type="text" />
                    </Grid>
                    <Grid item xs={6} textAlign="center">
                        <Button sx={{m:1}} variant="outlined" onClick={() => history.push('/home')}>return to home</Button>
                        <Button variant="contained" onClick={handleCreate}>create game</Button>
                    </Grid>
                </Grid>
            </Paper>

        </Container>
        // <>
        //     <div>
        //         <h3>Create New Game</h3>
        //         <button onClick={() => history.push('/home')}>return to home</button>
        //         <button onClick={handleCreate}>create game</button>

        //     </div>
        // </>
    )
}