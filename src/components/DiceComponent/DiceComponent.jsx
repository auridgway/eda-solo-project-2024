import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function DiceComponent(props) {
    const diceInfo = [
        { value: props.gameData[0].d1_val, locked: props.gameData[0].d1_locked, scored: props.gameData[0].d1_scored },
        { value: props.gameData[0].d2_val, locked: props.gameData[0].d2_locked, scored: props.gameData[0].d2_scored },
        { value: props.gameData[0].d3_val, locked: props.gameData[0].d3_locked, scored: props.gameData[0].d3_scored },
        { value: props.gameData[0].d4_val, locked: props.gameData[0].d4_locked, scored: props.gameData[0].d4_scored },
        { value: props.gameData[0].d5_val, locked: props.gameData[0].d5_locked, scored: props.gameData[0].d5_scored },
        { value: props.gameData[0].d6_val, locked: props.gameData[0].d6_locked, scored: props.gameData[0].d6_scored },
    ];
    const dispatch = useDispatch();

    function handleClick(key, payload, isLocked) {
        if (diceInfo[key].scored===false) {
            const action = {
                type: 'ADJUST_DICE',
                payload: { diceNumber: key, diceValue: payload, isLocked: !isLocked }
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