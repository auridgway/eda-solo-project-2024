import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function DashboardScreen() {
    const history = useHistory();
    const dispatch = useDispatch();
    const games = useSelector(store => store.games)
    const user = useSelector(store => store.user)
    const usersGames = userGames();

    useEffect(() => {
        const action = { type: 'FETCH_GAMES' };
        dispatch(action);
        const action2 = { type: 'FETCH_ALL_USERS' };
        dispatch(action2);
    }, [])

    function userGames(){
        const tempArray=[];
        for (const game of games){
            for (const players of game.players){
                if (players.user_id===user?.id){
                    tempArray.push(game);
                }
            }
        }
        return tempArray;
    }

    function handleResume(event) {
        history.push(`/game/${event.target.dataset.gameid}`);
    }

    function handleResign() {

    }

    return (
        <>
            <pre>in the dashboard</pre>
            {usersGames?.map((item, i) =>
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