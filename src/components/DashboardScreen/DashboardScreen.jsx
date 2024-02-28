import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

function getCurrentTurn(thisGame) {
    const players = thisGame.players;
    const currentPlayer = players.find((player) => player.user_id === thisGame.current_turn);
    const roundsArray = thisGame.rounds;
    const currentRound = roundsArray[0];
    const turnsArray = currentRound.rounds_players;
    const currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer.user_id);
    return currentTurn;
}

export default function DashboardScreen() {
    const history = useHistory();
    const dispatch = useDispatch();
    const games = useSelector(store => store.games)
    const user = useSelector(store => store.user)
    const usersGames = userGames();

    function userGames() {
        const tempArray = [];
        for (const game of games) {
            for (const players of game.players) {
                if (players.user_id === user?.id) {
                    tempArray.push(game);
                }
            }
        }
        return tempArray;
    }

    function handleResume(event) {
        history.push(`/game/${event.target.dataset.gameid}`);
        const currentGame = games.find(game => game.id === Number(event.target.dataset.gameid));
        const currentTurn = getCurrentTurn(currentGame);

        const action3 = {
            type: 'SET_DICE', payload: [
                { value: currentTurn.d1_val, locked: currentTurn.d1_locked, scored: currentTurn.d1_scored },
                { value: currentTurn.d2_val, locked: currentTurn.d2_locked, scored: currentTurn.d2_scored },
                { value: currentTurn.d3_val, locked: currentTurn.d3_locked, scored: currentTurn.d3_scored },
                { value: currentTurn.d4_val, locked: currentTurn.d4_locked, scored: currentTurn.d4_scored },
                { value: currentTurn.d5_val, locked: currentTurn.d5_locked, scored: currentTurn.d5_scored },
                { value: currentTurn.d6_val, locked: currentTurn.d6_locked, scored: currentTurn.d6_scored },]
        }
        dispatch(action3);
    }

    function handleLobby(event) {
        history.push(`/waiting/${event.target.dataset.gameid}`);
    }

    return (
        <>
            <pre>in the dashboard</pre>
            {usersGames?.map((item, i) =>
                <div key={i}>
                    <h3>{item.lobby_name}</h3>
                    <p>{item.players.length}/8</p>
                    <p>Current game status:{item.status}</p>
                    {item.status === 'inprogress' ? <button data-gameid={item.id} onClick={handleResume}>Resume Game</button> : <button data-gameid={item.id} onClick={handleLobby}>Back to Lobby</button>}

                </div>)}
        </>
    )
}