import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Multiplayer() {
    const games = useSelector(store => store.games);
    const joinableGames = games?.filter((game) => game.status === 'created');
    const history = useHistory();
    const dispatch = useDispatch();

    function handleJoin(gameId) {

        const selectedGame = games.filter((game)=>game.id === Number(gameId));
        const roundId = selectedGame[0].rounds[selectedGame[0].rounds.length-1].id

        const action = { type: 'JOIN_GAME', payload: { game_id: gameId, round_id: roundId } }
        dispatch(action);
        history.push(`/waiting/${gameId}`);
    }
    return (
        <>
            <div>
                {joinableGames?.map((game, i) =>
                    <div key={i}>
                        <h3>{game.lobby_name}</h3>
                        <p>{game.players.length}/8</p>
                        <button data-gameid={game.id} onClick={(e) => handleJoin(e.target.dataset.gameid)}>Join</button>
                    </div>
                )}
            </div>
        </>
    )
}