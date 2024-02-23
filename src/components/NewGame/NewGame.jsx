import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function NewGame() {
    const history = useHistory();
    const dispatch = useDispatch();
    const games = useSelector(store => store.games)
    const user = useSelector(store => store.user)
    const [lobbyName, setLobbyName] = useState('');
    const [passphrase, setPassphrase] = useState('');

    function handleCreate() {
        const action = { type: 'CREATE_GAME', payload: { lobby_name: lobbyName } }
        dispatch(action)
        let ownersGames = games.filter((game) => game.owner_id === user.id);
        history.push(`/waiting/${ownersGames[ownersGames.length - 1].id}`)
    }

    return (
        <>
            <div>
                <h3>Create New Game</h3>
                <input value={lobbyName} onChange={(e) => setLobbyName(e.target.value)} placeholder='lobby name' type="text" />
                <input value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder='passphrase' type="password" />
                <button onClick={() => history.push('/home')}>return to home</button>
                <button onClick={handleCreate}>create game</button>

            </div>
        </>
    )
}