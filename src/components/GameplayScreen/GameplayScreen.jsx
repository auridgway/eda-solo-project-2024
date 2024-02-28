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
    const currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer);
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

    if (currentGame === undefined || games.length <= 0) {
        return <h1>Loading...</h1>
    }

    const currentTurn = getCurrentTurn(currentGame);

    function handleRoll() {
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
                        <p>current turn:{currentGame?.current_turn}</p>
                        <p>current score:{currentTurn?.current_score}</p>
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