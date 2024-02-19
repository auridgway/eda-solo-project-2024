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

    return (
        <>
            {diceInfo.map((item, i) => <div key={i}><p onClick={() => handleClick(i, item.value, item.locked)}>{item.locked === false ? '🔓' : '🔒'}</p><p>{item.value}</p>{console.log(i)}</div>)}
        </>
    )
}