import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DiceComponents from "../DiceComponent/DiceComponent"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useMemo } from "react"

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import DiceComponent from "../DiceComponent/DiceComponent"
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';


function getCurrentTurn(thisGame) {
    const players = thisGame.players;
    const currentPlayer = players.find((player) => player.user_id === thisGame.current_turn);
    const roundsArray = thisGame.rounds;
    const currentRound = roundsArray[0];
    const turnsArray = currentRound.rounds_players;
    const currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer.user_id);
    return currentTurn;
}

export default function GameplayScreen() {
    // for gameplay screen the state we will need will include, the current score, and the dice to see if they are locked and 
    // their values
    let { gameid } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const games = useSelector(store => store.games)
    const dice = useSelector(store => store.dice)
    const user = useSelector(store => store.user)

    const currentGame = games.find(game => game.id === Number(gameid));
    let currentTurn = {};
    let currentPlayer = '';
    let trackedScore = 0;
    let currentScore = 0;
    console.log(currentGame);

    useEffect(() => {
        const action = {
            type: 'SET_DICE', payload: [
                { value: currentTurn.d1_val, locked: currentTurn.d1_locked, scored: currentTurn.d1_scored },
                { value: currentTurn.d2_val, locked: currentTurn.d2_locked, scored: currentTurn.d2_scored },
                { value: currentTurn.d3_val, locked: currentTurn.d3_locked, scored: currentTurn.d3_scored },
                { value: currentTurn.d4_val, locked: currentTurn.d4_locked, scored: currentTurn.d4_scored },
                { value: currentTurn.d5_val, locked: currentTurn.d5_locked, scored: currentTurn.d5_scored },
                { value: currentTurn.d6_val, locked: currentTurn.d6_locked, scored: currentTurn.d6_scored }]
        }
        dispatch(action);
    }, [currentGame])
    // TODO:
    // when live if you lock in dice it will refresh deleting your turn

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: 'FETCH_GAMES' })
        }, 5000);
        return () => clearInterval(interval);
    });

    if (currentGame === undefined || games.length <= 0 || currentGame.rounds[0] === undefined) {
        return <LinearProgress color="secondary" />
    } else {
        currentTurn = getCurrentTurn(currentGame);
        currentPlayer = currentGame.players.find((player) => player.user_id === currentTurn.player_id).username;
        trackedScore = currentTurn.turn_score === undefined ? 0 : currentTurn.turn_score;
        currentScore = currentTurn.current_score;
    }
    function handleRoll() {
        console.log(dice);
        if (currentGame.roundNumber === 0) {
            alert('invalid roll');
        } else {
            const action = { type: 'ROLL_DICE', payload: { game_id: Number(gameid), dice: dice } }
            dispatch(action);
        }
    }
    function handleSave() {
        if (currentGame.roundNumber === 0) {
            alert('invalid save');
        } else {
            const action = { type: 'SAVE_SCORE', payload: { game_id: Number(gameid), dice: dice } }
            dispatch(action);
        }
    }

    return (
        <Container>
            <Typography color='primary' sx={{my:3}} variant="h2">{currentGame?.lobby_name}</Typography>
            {currentGame.status !== 'completed' ?
                <Grid container spacing={2} direction='row'>
                    <Grid item xs={8}>
                        {/* actual game space is right here */}
                        <Paper sx={{ p: 1, m: 1 }} >
                            <Grid container alignItems="center" justifyContent="center" direction='row'>
                                <Grid spacing={2} xs={4} alignItems="center" justifyContent="center" direction='row'>
                                    <Grid item >
                                        <Typography variant="h5" textAlign='center' fontWeight={700}>Player's Turn:</Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography variant="h5" textAlign='center' >{currentPlayer}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid spacing={2} xs={4} alignItems="center" justifyContent="center" direction='row'>
                                    <Grid item >
                                        <Typography variant="h5" textAlign='center' fontWeight={700}>Tracked Score:</Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography variant="h5" textAlign='center' >{currentScore}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid spacing={2} xs={4} alignItems="center" justifyContent="center" direction='row'>
                                    <Grid item >
                                        <Typography variant="h5" textAlign='center' fontWeight={700}>Current Score:</Typography>
                                    </Grid>
                                    <Grid item >
                                        <Typography variant="h5" textAlign='center' >{trackedScore}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 2 }} />
                            <Grid container direction='column'>
                                <DiceComponent gameId={gameid} />
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" direction='row' spacing={2}>
                                <Grid item textAlign='center' xs={6}>
                                    {currentGame.current_turn === user.id ? <Button sx={{ px: 14 }} variant="contained" color='info' onClick={handleRoll}>Roll</Button> : ''}
                                </Grid>
                                <Grid item textAlign='center' xs={6}>
                                    {currentGame.current_turn === user.id ? <Button sx={{ px: 11.5 }} variant="contained" color='success' onClick={handleSave}>Save Score</Button> : ''}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper sx={{ p: 1, m: 1 }} >
                            <Typography variant="h5" textAlign="center">Current Points</Typography>
                            <Grid container spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography variant="h6" textAlign="center" fontWeight={700}>Player</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" textAlign="center" fontWeight={700}>Score</Typography>
                                </Grid>
                            </Grid>
                            {currentGame.players.map((player) =>
                                <Grid container spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" textAlign="center" >{player.username}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" textAlign="center" >{player.score}</Typography>
                                    </Grid>
                                </Grid>)}
                        </Paper>
                        <Paper sx={{ p: 1, m: 1 }} >
                            <Typography variant="h5" textAlign="center">Scoring Rules</Typography>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" fontWeight={700}>Combination</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" fontWeight={700}>Reward</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Single 5</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >50 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Single 1</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >100 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Three 1's</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >300 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Three 2's</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >200 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Three 3's</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >300 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Three 4's</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >400 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Three 5's</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >500 Points</Typography>
                                </Grid>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >Three 6's</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography textAlign="center" >600 Points</Typography>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >4 of Any Number</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >1000 Points</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >5 of Any Number</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >2000 Points</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >6 of Any Number</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >6000 Points</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >1-6 Straight</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >1500 Points</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >Three Pairs</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >1500 Points</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >Four of Any Number with a Pair</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >1500 Points</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >Two Triplets</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography textAlign="center" >2500 Points</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                :
                <Grid container spacing={2} direction='row'>
                    <Grid item xs={3}>

                    </Grid>
                    <Grid item xs={6}>
                        {/* actual game space is right here */}
                        <Paper sx={{ p: 1, m: 1 }} >
                            <Typography textAlign='center' variant="h3">Winner!</Typography>
                            <Typography textAlign='center' variant="h5">👑 {currentGame.players.find((player) => player.user_id === currentGame.winner_id).username} 👑</Typography>
                            <Typography textAlign='center' variant="h5">Score: {currentGame.players.find((player) => player.user_id === currentGame.winner_id).score} points</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>

                    </Grid>
                </Grid>
            }
        </Container>
    )
}

