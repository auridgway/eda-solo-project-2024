import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Container } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Multiplayer() {
    const games = useSelector(store => store.games);
    const joinableGames = games?.filter((game) => game.status === 'created');
    const history = useHistory();
    const dispatch = useDispatch();

    function handleJoin(gameId) {

        const selectedGame = games.find((game) => game.id === Number(gameId));
        console.log(selectedGame)

        const action = { type: 'JOIN_GAME', payload: { game_id: gameId } }
        dispatch(action);
        history.push(`/waiting/${gameId}`);
    }


    return (
        <Container>
            <Typography color='primary' sx={{my:3}} variant="h2">Multiplayer</Typography>
            {joinableGames?.map((game, i) =>
                <Paper sx={{ p: 1, m: 1 }} key={i}>
                    <Grid alignItems="center" justifyContent="center" container spacing={2}>
                        <Grid item xs={4} textAlign="center">
                            <Typography variant="h5">{game.lobby_name}</Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <Typography>Players: </Typography><Typography variant="body1" fontWeight={700}>{game.players.length}/8</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                            <Button variant="contained" data-gameid={game.id} onClick={(e) => handleJoin(e.target.dataset.gameid)}>Join</Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Container>
    )
}