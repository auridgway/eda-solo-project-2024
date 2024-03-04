import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import DiceComponent from "../DiceComponent/DiceComponent"
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Scoring from "../Scoring/Scoring";
import './GameplayScreen.css'
import { motion, AnimatePresence } from "framer-motion";


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
    const farkled = useSelector(store => store.farkle)
    const AnimatedText = motion(Typography);
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
            if (currentGame.current_turn === user.id) {
                // do nothing if it is your turn
            } else {
                // if it's not your turn constantly refresh to check game
                dispatch({ type: 'FETCH_GAMES' })
            }
        }, 1000);
        return () => clearInterval(interval);
    });

    if (currentGame === undefined || games.length <= 0 || currentGame.rounds[0] === undefined) {
        return <LinearProgress color="secondary" />
    } else {
        currentTurn = getCurrentTurn(currentGame);
        currentPlayer = currentGame.players.find((player) => player.user_id === currentTurn.player_id).username;
        trackedScore = currentTurn.turn_score === undefined ? 0 : currentTurn.turn_score;
        currentScore = currentTurn.current_score;
        if (currentTurn.farkled === false){
            const action = {type:'SET_FARKLE', payload: {hasFarkled: false}}
            dispatch(action);
        }
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
            <Typography color='primary' sx={{ my: 3 }} variant="h2">{currentGame?.lobby_name}</Typography>
            {currentGame.status !== 'completed' ?
                <Paper sx={{
                    backgroundColor: "#fdf0e2",
                    p: 1, m: 1
                }} elevation={1}>
                    <Grid container spacing={2} direction='row'>
                        <Grid item xs={8}>
                            {/* actual game space is right here */}
                            <Paper sx={{ p: 1, m: 1 }} elevation={3} >
                                <Grid container alignItems="center" justifyContent="center" direction='row'>
                                    <Grid spacing={2} xs={4} alignItems="center" justifyContent="center" direction='row'>
                                        <Grid item >
                                            <Typography color='secondary' variant="h5" textAlign='center' fontWeight={700}>Player's Turn:</Typography>
                                        </Grid>
                                        <Grid item >
                                            <Typography variant="h5" textAlign='center' >{currentPlayer}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid spacing={2} xs={4} alignItems="center" justifyContent="center" direction='row'>
                                        <Grid item >
                                            <Typography color='secondary' variant="h5" textAlign='center' fontWeight={700}>Tracked Score:</Typography>
                                        </Grid>
                                        <Grid item >
                                            <Typography variant="h5" textAlign='center' >{currentScore}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid spacing={2} xs={4} alignItems="center" justifyContent="center" direction='row'>
                                        <Grid item >
                                            <Typography color='secondary' variant="h5" textAlign='center' fontWeight={700}>Current Score:</Typography>
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
                                <Grid container alignItems="center" justifyContent="center" direction='row' spacing={2} sx={{ my: 2 }}>
                                    <Grid item textAlign='center' xs={6}>
                                        {currentGame.current_turn === user.id ? <Button fullWidth variant="contained" color='primary' onClick={handleRoll}>Roll</Button> : ''}
                                    </Grid>
                                    <Grid item textAlign='center' xs={6}>
                                        {currentGame.current_turn === user.id ? <Button fullWidth variant="contained" color='success' onClick={handleSave}>Save Score</Button> : ''}
                                    </Grid>
                                </Grid>
                            </Paper>
                            <Grid container direction='column' display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                <AnimatePresence mode="wait">
                                    {farkled ? <motion.svg textAlign='center' initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ duration: 1 }} exit={{ scale: 0 }} className='farkled' width="175" height="75" xmlns="http://www.w3.org/2000/svg" key='DSA3r2de2F21!@#'>
                                        <g>
                                            <title>Layer 1</title>
                                            <g stroke="null" id="svg_6">
                                                <rect stroke="#994636" rx="5" stroke-width="6" id="svg_3" height="52.34315" width="146" y="12" x="15" fill="none" />
                                                <text stroke="#994636" transform="matrix(1.18276 0 0 1.21977 -82.0314 -87.3101)" font-style="normal" font-weight="700" xml:space="preserve" text-anchor="start" font-size="24" id="svg_5" y="110.88311" x="91.91131" stroke-width="0" fill="#994636">FARKLED</text>
                                            </g>
                                        </g>
                                    </motion.svg> : ''}
                                </AnimatePresence>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper sx={{ p: 1, m: 1 }} >
                                <Typography color='primary' variant="h5" textAlign="center">Current Points</Typography>
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
                            <Scoring />
                        </Grid>
                    </Grid>
                </Paper>
                :
                <Grid container spacing={2} direction='row'>
                    <Grid item xs={3}>

                    </Grid>
                    <Grid item xs={6}>
                        {/* actual game space is right here */}
                        <Paper sx={{ p: 1, m: 1 }} >
                            <Typography color='primary' textAlign='center' variant="h3">Winner!</Typography>
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

