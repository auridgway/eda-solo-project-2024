import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

export default function NewGame({ open, setOpen }) {
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
        setOpen(false);

        history.push(`/dashboard`);

    }


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <Grid component='form' direction='column' autoComplete="off" alignItems="center" justifyContent="center" container spacing={2}>
                <Paper sx={{
                    p: 1, m: 1,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(0%, 75%)',
                }}>
                    <Grid item xs={10.75} sx={{m:2}} textAlign="center">
                        <Typography sx={{m:2}} color='primary' variant="h3">Create New Game</Typography>
                        <TextField fullWidth sx={{m:1}} label='Lobby Name' variant="outlined" value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} type="text" />
                        <Button fullWidth sx={{m:1}} variant="contained" onClick={handleCreate}>create game</Button>
                        <Button fullWidth sx={{m:1}} variant="outlined" color="secondary" onClick={handleClose}>Close</Button>
                    </Grid>
                </Paper>
            </Grid>
        </Container>
    )
}