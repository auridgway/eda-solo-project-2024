import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function WaitingRoom() {
    let { gameid } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const games = useSelector(store => store.games);
    const user = useSelector(store => store.user);
    const currentGame = (games?.filter((item) => item.id === Number(gameid)));
    // const currentGame = (games?.find(item => item.id === Number(gameid)))
    function handleStart() {
        const action = { type: 'START_GAME', payload: gameid };
        dispatch(action);
        history.push(`/game/${gameid}`);
    }

    return (

        <Container>
            <Grid alignItems="center" justifyContent="center" container spacing={2}>
                {currentGame[0].status !== 'complete' ?
                    currentGame?.map((game, i) =>
                        <Grid item key={i}>
                            <Paper sx={{ p: 1, m: 1 }}>
                                <Typography variant="h3">Waiting for players ({game.players.length}/8)</Typography>
                                {game.players.map((currentPlayer) => <Typography>{currentPlayer.username}</Typography>)}
                                <Button variant="outlined" onClick={() => history.push('/home')}>Return to Home</Button>
                                {user.id === game.owner_id ? <Button variant="contained" onClick={handleStart}>Start Game</Button> : ''}
                            </Paper>
                        </Grid>
                    )
                    :
                    <Grid item textAlign='center'>
                        <Paper sx={{ p: 1, m: 1 }}>
                            <Typography variant="h3">Game Concluded</Typography>
                            <Typography variant="body1">Winner: {currentGame[0].players.find((player) => player.user_id === currentGame[0].winner_id).username}</Typography>
                            <Typography variant="body1">Score: {currentGame[0].players.find((player) => player.user_id === currentGame[0].winner_id).score}</Typography>
                            <Button variant="outlined" onClick={() => history.push('/home')}>Return to Home</Button>
                        </Paper>
                    </Grid>
                }
            </Grid>
        </Container>

    )
}