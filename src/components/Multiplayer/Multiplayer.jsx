import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Multiplayer() {
    const games = useSelector(store => store.games);
    const joinableGames = games?.filter((game) => game.status === 'created');
    const history = useHistory();
    const dispatch = useDispatch();

    function handleJoin(gameId, roundId) {
        // const action = { type: 'JOIN_GAME', payload: { game_id: gameId, round_id: roundId } }
        // dispatch(action);
        history.push(`/waiting/${gameId}`);
    }
    return (
        <>
            <div>
                {joinableGames?.map((game, i) =>
                    <div key={i}>
                        <h3>{game.lobby_name}</h3>
                        <p>{game.players.length}/8</p>
                        <button data-gameid={game.id} data-roundid={game.rounds.id} onClick={(e) => handleJoin(e.target.dataset.gameid, e.target.dataset.roundid)}>Join</button>
                    </div>
                )}
            </div>
        </>
    )
}