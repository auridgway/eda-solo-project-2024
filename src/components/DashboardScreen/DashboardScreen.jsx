import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function DashboardScreen() {
    const history = useHistory();
    const dispatch = useDispatch();
    const games = useSelector(store => store.games)

    useEffect(() => {
        const action = { type: 'FETCH_GAMES' };
        dispatch(action);
        const action2 = { type: 'FETCH_ALL_USERS' };
        dispatch(action2);
    }, [])

    function handleResume(event) {
        history.push(`/game/${event.target.dataset.gameid}`);
    }

    function handleResign() {

    }

    return (
        <>
            <pre>in the dashboard</pre>
            {games?.map((item, i) =>
                <div key={i}>
                    <h3>{item.lobby_name}</h3>
                    <p>{item.players.length}/8</p>
                    <p>Current game status:{item.status}</p>
                    <button data-gameid={item.id} onClick={handleResume}>Resume Game</button>
                    <button onClick={handleResign}>Resign Game</button>

                </div>)}
        </>
    )
}