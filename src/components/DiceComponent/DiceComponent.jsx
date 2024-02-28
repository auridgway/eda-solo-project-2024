import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
            dispatch(action);
        } else {
            alert('Cannot unlock already scored dice!');
        }
    }
    // allow users to send off bad melds and let the server respond with if it's good or bad
    // let server check for all melds at start
    // let server check for farkles
    return (
        <>
            {diceInfo?.map((item, i) =>
                <div key={i}>
                    <p onClick={() => handleClick(i)}>{item.locked === false ? '🔓' : '🔒'}</p>
                    <p>{item.value}</p>
                </div>)}
        </>
    )
}