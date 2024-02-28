import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DiceComponents from "../DiceComponent/DiceComponent"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useMemo } from "react"

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

    const currentGame = games.find(game => game.id === Number(gameid));
    let currentTurn = {};
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

    if (currentGame === undefined || games.length <= 0 || currentGame.rounds[0] === undefined) {
        return <h1>Loading...</h1>
    } else {
        currentTurn = getCurrentTurn(currentGame);
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
        <div>
            <div>
                <p>{currentGame?.id}</p>
                <div>
                    <div>
                        <p>current turn:{currentGame.current_turn}</p>
                        <p>current score:{currentTurn.current_score}</p>
                        <p>turn score: {currentTurn.turn_score ? currentTurn.turn_score : 0}</p>
                        <DiceComponents gameId={gameid} games={games} />
                        {currentGame?.roundNumber === 0 ? '' : <button onClick={handleRoll}>Roll</button>}
                        {currentGame?.roundNumber === 0 ? '' : <button onClick={handleSave}>Save Score</button>}
                    </div>
                </div>
            </div>
            <div>

                <div>
                    <div>
                        <div>
                            {/* score go here */}
                        </div>
                        <div>
                            {/* melds go here */}
                        </div>
                    </div>
                </div>
                <button onClick={() => history.push('/home')}>return to home</button>
            </div>
        </div>
    )
}