import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { Container } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



function getCurrentTurn(thisGame) {
    const players = thisGame.players;
    const currentPlayer = players.find((player) => player.user_id === thisGame.current_turn);
    const roundsArray = thisGame.rounds;
    const currentRound = roundsArray[0];
    const turnsArray = currentRound.rounds_players;
    const currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer.user_id);
    return currentTurn;
}

export default function DashboardScreen() {
    const history = useHistory();
    const dispatch = useDispatch();
    const games = useSelector(store => store.games)
    const user = useSelector(store => store.user)
    const usersGames = userGames();

    function userGames() {
        const tempArray = [];
        for (const game of games) {
            for (const players of game.players) {
                if (players.user_id === user?.id) {
                    tempArray.push(game);
                }
            }
        }
        return tempArray;
    }

    function handleResume(event) {
        history.push(`/game/${event.target.dataset.gameid}`);
        const currentGame = games.find(game => game.id === Number(event.target.dataset.gameid));
        const currentTurn = getCurrentTurn(currentGame);

        const action3 = {
            type: 'SET_DICE', payload: [
                { value: currentTurn.d1_val, locked: currentTurn.d1_locked, scored: currentTurn.d1_scored },
                { value: currentTurn.d2_val, locked: currentTurn.d2_locked, scored: currentTurn.d2_scored },
                { value: currentTurn.d3_val, locked: currentTurn.d3_locked, scored: currentTurn.d3_scored },
                { value: currentTurn.d4_val, locked: currentTurn.d4_locked, scored: currentTurn.d4_scored },
                { value: currentTurn.d5_val, locked: currentTurn.d5_locked, scored: currentTurn.d5_scored },
                { value: currentTurn.d6_val, locked: currentTurn.d6_locked, scored: currentTurn.d6_scored },]
        }
        dispatch(action3);
    }

    function handleLobby(event) {
        history.push(`/waiting/${event.target.dataset.gameid}`);
    }

    return (

        <Container>
            <Typography color='primary' sx={{my:3}} variant="h2">Dashboard</Typography>
            {usersGames?.map((item, i) =>
                <Paper sx={{ p: 1, m: 1 }} key={i}>
                    <Grid alignItems="center" justifyContent="center" container spacing={2}>
                        <Grid item xs={3} textAlign="center">
                            <Typography variant="h5">{item.lobby_name}</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                            <Typography>Players: </Typography><Typography variant="body1" fontWeight={700}>{item.players.length}/8</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                            <Typography variant="body2">Current game status: </Typography><Typography variant="body1" fontWeight={700}>{item.status}</Typography>
                        </Grid>
                        <Grid item xs={3} textAlign="center">
                            {item.status === 'inprogress' ? <Button variant="contained" data-gameid={item.id} onClick={handleResume}>Resume Game</Button> : <Button variant="outlined" color='secondary' data-gameid={item.id} onClick={handleLobby}>Back to Lobby</Button>}
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Container>

    )
}