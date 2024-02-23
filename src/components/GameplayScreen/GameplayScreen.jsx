import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DiceComponents from "../DiceComponent/DiceComponent"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import axios from "axios"

export default function GameplayScreen() {
    // for gameplay screen the state we will need will include, the current score, and the dice to see if they are locked and 
    // their values
    let { gameid } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const games = useSelector(store => store.games)
    console.log(games)
    const currentGame = (games?.filter((item) => item.id === Number(gameid)))
    // 
    function handleRoll() {
        if (currentGame[0].roundNumber === 0) {
            alert('invalid roll');
        } else {
            const action = { type: 'ROLL_DICE', payload: { gameId: currentGame[0].id, gameState: currentGame[0].rounds[rounds.length - 1].rounds_players[rounds_players.length - 1] } }
            dispatch(action);
        }
    }
    function handleSave() {
        if (currentGame[0].roundNumber === 0) {
            alert('invalid save');
        } else {
            const action = { type: 'SAVE_SCORE', payload: currentGame[0].id }
            dispatch(action);
        }
    }

    return (
        <div>
            {currentGame?.map((item, i) =>
                <div key={i}><p>{item.id}</p>
                    <div>
                        <div>
                            <p>current turn:{item.players.filter(players => players.user_id === item.rounds[0].rounds_players[item.rounds[0].rounds_players.length - 1].player_id)[0].username}</p>
                            <p>current score:{item.rounds[0].rounds_players.filter(round => round.player_id === item.players.filter((player) => Number(player.id) === 1)[0].id)[0].current_score}</p>
                            <DiceComponents gameId={gameid} />
                            {currentGame[0].roundNumber === 0 ? '' : <button onClick={handleRoll}>Roll</button>}
                            {currentGame[0].roundNumber === 0 ? '' : <button onClick={handleSave}>Save Score</button>}
                        </div>
                    </div>
                </div>)}
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