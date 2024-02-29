import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect } from "react";

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

    function handleLeave() {
        const action = { type: 'LEAVE_GAME', payload: gameid };
        dispatch(action);
        history.push(`/multiplayer`);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: 'FETCH_GAMES' })
        }, 2000);
        return () => clearInterval(interval);
    });

    if (currentGame[0]?.status === 'inprogress') {
        history.push(`/game/${gameid}`);
    }


    return (

        <Container>
                {currentGame[0]?.status !== 'completed' ?
                    currentGame?.map((game, i) =>
                        <Grid alignItems="center" justifyContent="center" direction={"column"} container spacing={2}>
                            <Typography variant="h2" sx={{ my: 3 }} color='primary'>Waiting for players ({game.players.length}/8)</Typography>
                            <Paper sx={{ p: 1, m: 1 }} >
                                <Grid item key={i}>
                                    {game.players.map((currentPlayer) => <Typography variant="h4">{currentPlayer.username}</Typography>)}
                                    <Button sx={{m:1}} variant="outlined" color="secondary" onClick={() => history.push('/home')}>Return to Home</Button>
                                    {user.id === game.owner_id ? <Button sx={{m:1}} variant="contained" onClick={handleStart}>Start Game</Button> : ''}
                                    {user.id === game.owner_id ? '' : <Button sx={{m:1}} variant="contained" color="secondary" onClick={handleLeave}>Leave Game</Button>}
                                </Grid>
                            </Paper>
                        </Grid>
                    )
                    :
                    <Grid container alignItems="center" justifyContent="center" direction={"column"}>
                        <Typography sx={{ my: 3 }} color='primary' variant="h2">Game Concluded</Typography>
                        <Paper sx={{ p: 1, m: 2 }}>
                        <Grid item >
                            <Typography sx={{m:1}} variant="h4">Winner: {currentGame[0].players.find((player) => player.user_id === currentGame[0].winner_id).username}</Typography>
                            <Typography sx={{m:1}} variant="h4">Score: {currentGame[0].players.find((player) => player.user_id === currentGame[0].winner_id).score}</Typography>
                            <Button sx={{my:1}} fullWidth variant="outlined" color='secondary' onClick={() => history.push('/home')}>Return to Home</Button>
                        </Grid>
                        </Paper>
                    </Grid>
                }
        </Container>

    )
}