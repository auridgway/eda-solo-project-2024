import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function DiceComponent(props) {
    const games = useSelector(store => store.games)
    const currentGame = (games?.filter((item) => item.id === Number(props.gameId))[0])
    const currentTurn = currentGame?.rounds[currentGame.rounds.length - 1].rounds_players[currentGame.rounds[currentGame.rounds.length - 1].rounds_players.length - 1];
    const [diceInfo, setDiceInfo] = useState([]);
    let updateDiceState = [
        { value: currentTurn?.d1_val, locked: currentTurn?.d1_locked, scored: currentTurn?.d1_scored },
        { value: currentTurn?.d2_val, locked: currentTurn?.d2_locked, scored: currentTurn?.d2_scored },
        { value: currentTurn?.d3_val, locked: currentTurn?.d3_locked, scored: currentTurn?.d3_scored },
        { value: currentTurn?.d4_val, locked: currentTurn?.d4_locked, scored: currentTurn?.d4_scored },
        { value: currentTurn?.d5_val, locked: currentTurn?.d5_locked, scored: currentTurn?.d5_scored },
        { value: currentTurn?.d6_val, locked: currentTurn?.d6_locked, scored: currentTurn?.d6_scored },
    ];
    
    useEffect(() => {
        setDiceInfo(updateDiceState);
    }, [games])

    const dispatch = useDispatch();

    // when this gets clicked we need to do these things
    // 1. 
    function handleClick(key) {
        if (updateDiceState[key].scored === false && updateDiceState[key].locked === false) {
            updateDiceState[key].locked = true;
            const action = {
                type: 'ADJUST_DICE',
                payload: {updateDiceState, currentGame}
            }
            setDiceInfo(updateDiceState);
            dispatch(action);
        } else if (updateDiceState[key].scored === false && updateDiceState[key].locked === true) {
            updateDiceState[key].locked = false;
            const action = {
                type: 'ADJUST_DICE',
                payload: {updateDiceState, currentGame}
            }
            setDiceInfo(updateDiceState);
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
            {diceInfo?.map((item, i) => <div key={i}><p onClick={() => handleClick(i)}>{item.locked === false ? '🔓' : '🔒'}</p><p>{item.value}</p></div>)}
        </>
    )
}