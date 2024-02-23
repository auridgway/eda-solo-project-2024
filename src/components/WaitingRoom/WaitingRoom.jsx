import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";


export default function WaitingRoom() {
    let { gameid } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const games = useSelector(store => store.games);
    const user = useSelector(store => store.user);
    const users = useSelector(store => store.allUsers);
    const currentGame = (games?.filter((item) => item.id === Number(gameid)));

    return (
        <>
            <div>
                {currentGame?.map((game, i) =>
                    <div key={i}>
                        <h3>Waiting for players ({game.players.length}/8)</h3>
                        {game.players.map((currentPlayer) => <p>{currentPlayer.username}</p>)}
                        <button onClick={()=>history.push('/home')}>Return to Home</button>
                        {user.id === game.owner_id ? <button>Start Game</button> : ''}
                    </div>
                )}
            </div>
        </>
    )
}