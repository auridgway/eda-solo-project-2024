import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function DiceComponent(props) {
    const games = useSelector(store => store.games)
    const currentGame = (games?.filter((item) => item.id === Number(props.gameId))[0])


    const diceInfo = [
        { value: currentGame.d1_val, locked: currentGame.d1_locked, scored: currentGame.d1_scored },
        { value: currentGame.d2_val, locked: currentGame.d2_locked, scored: currentGame.d2_scored },
        { value: currentGame.d3_val, locked: currentGame.d3_locked, scored: currentGame.d3_scored },
        { value: currentGame.d4_val, locked: currentGame.d4_locked, scored: currentGame.d4_scored },
        { value: currentGame.d5_val, locked: currentGame.d5_locked, scored: currentGame.d5_scored },
        { value: currentGame.d6_val, locked: currentGame.d6_locked, scored: currentGame.d6_scored },
    ];
    const [D1, setD1] = useState(diceInfo[1]);
    const dispatch = useDispatch();

    function handleClick(key, payload, isLocked) {
        if (diceInfo[key].scored === false) {
            diceInfo[key].locked = true;
            const action = {
                type: 'ADJUST_DICE',
                payload: diceInfo
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
            {diceInfo.map((item, i) => <div key={i}><p onClick={() => handleClick(i, item.value, item.locked)}>{item.locked === false ? '🔓' : '🔒'}</p><p>{item.value}</p>{console.log(i)}</div>)}
        </>
    )
}