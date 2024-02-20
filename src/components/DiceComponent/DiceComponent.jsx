import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function DiceComponent(props) {
    const diceInfo = useSelector(store => store.diceInfo);
    const dispatch = useDispatch();

    function handleClick(key, payload, isLocked) {
        console.log(key);
        if (isLocked) {
            const action = {
                type: 'UNLOCK_DICE',
                payload: { diceNumber: key, diceValue: payload }
                
            }
            dispatch(action);

        } else {
            const action = {
                type: 'LOCK_DICE',
                payload: { diceNumber: key, diceValue: payload }
            }
            dispatch(action);
        }
    }
    // allow users to send off bad melds and let the server respond with if it's good or bad
    // let server check for all melds at start
    // let server check for farkles
    return (
        <>
            {diceInfo.map((item, i) => <div key={i}><p onClick={() => handleClick(i, item.value, item.locked)}>{item.locked === false ? '🔓' : '🔒'}</p><p>{item.value}</p>{console.log(i)}</div>)}
            <button>Roll</button>
            <button>Save Score</button>
        </>
    )
}