import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";

function getCurrentTurn(thisGame, dispatch) {
    const players = thisGame.players;
    const currentPlayer = players.find((player) => player.user_id === thisGame.current_turn);
    const roundsArray = thisGame.rounds;
    const currentRound = roundsArray[0];
    const turnsArray = currentRound.rounds_players;
    const currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer.user_id);

    return currentTurn;
}

export default function DiceComponent(props) {

    const games = useSelector(store => store.games);
    const diceInfo = useSelector(store => store.dice);
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const gameid = props.gameId;

    const currentGame = games.find(game => game.id === Number(gameid));
    let currentTurn = {};

    if (currentGame === undefined || games.length <= 0 || currentGame.rounds[0] === undefined) {
        return <h1>Loading...</h1>
    } else {
        currentTurn = getCurrentTurn(currentGame);
    }

    function handleClick(key) {
        let tempDice = diceInfo;
        console.log(diceInfo)
        if (diceInfo[key].scored === false && diceInfo[key].locked === false) {
            tempDice[key].locked = true;
            const action = {
                type: 'ADJUST_DICE',
                payload: {
                    tempDice,
                    currentGame
                }
            }
            dispatch(action);
        } else if (diceInfo[key].scored === false && diceInfo[key].locked === true) {
            tempDice[key].locked = false;
            const action = {
                type: 'ADJUST_DICE',
                payload: {
                    tempDice,
                    currentGame
                }
            }
            dispatch(action);1
        } else {
            alert('Cannot unlock already scored dice!');
        }
    }
    // allow users to send off bad melds and let the server respond with if it's good or bad
    // let server check for all melds at start
    // let server check for farkles
    return (

        <Grid container spacing={2} alignItems="center" justifyContent="center" direction='row'>
            {diceInfo?.map((item, i) =>
                <Grid textAlign='center' item xs={4} key={i}>
                    {currentGame.current_turn === user.id ? <Typography fontSize={'200%'} onClick={() => handleClick(i)}>{item.locked === false ? '🔓' : '🔒'}</Typography> : ''}
                    <Typography fontSize={'200%'} >{item.value}</Typography>
                </Grid>)}
        </Grid>

    )
}