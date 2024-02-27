import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DiceComponents from "../DiceComponent/DiceComponent"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useMemo } from "react"

export default function GameplayScreen() {
    // for gameplay screen the state we will need will include, the current score, and the dice to see if they are locked and 
    // their values
    let { gameid } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const games = useSelector(store => store.games)
    const [currentGame, setCurrentGame] = useState([]);
    const [currentTurns, setCurrentTurn] = useState([]);

    useEffect(() => {
        setCurrentGame(games?.filter((item) => item.id === Number(gameid))[0])
        setCurrentTurn(drill());
    }, [JSON.stringify(games)])


    function drill() {
        if (games.length <= 0) {
            return [];
        } else {
            let roundsArray = games[games.findIndex((item) => item.id === Number(gameid))].rounds;
            let currentRound = roundsArray[roundsArray.length - 1];
            let turnsArray = currentRound.rounds_players;
            let currentTurn = turnsArray[turnsArray.length - 1];
            return currentTurn;
        }
    }

    function handleRoll() {
        if (currentGame.roundNumber === 0) {
            alert('invalid roll');
        } else {
            const action = { type: 'ROLL_DICE', payload: currentGame }
            dispatch(action);
        }
    }
    function handleSave() {
        if (currentGame.roundNumber === 0) {
            alert('invalid save');
        } else {
            const action = { type: 'SAVE_SCORE', payload: currentGame }
            dispatch(action);
        }
    }

    return (
        <div>
            <div>
                <p>{currentGame?.id}</p>
                <div>
                    <div>
                        <p>current turn:{'' && currentGame?.players[currentGame?.players?.findIndex((player) => player.id === currentTurns.player_id)]?.username}</p>
                        <p>current score:{currentTurns?.current_score}</p>
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