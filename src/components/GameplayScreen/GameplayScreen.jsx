import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import DiceComponents from "../DiceComponent/DiceComponent"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import axios from "axios"

export default function GameplayScreen() {
    // for gameplay screen the state we will need will include, the current score, and the dice to see if they are locked and 
    // their values
    let { gameid } = useParams();
    const games = useSelector(store => store.games)
    const users = useSelector(store => store.allUsers);
    const currentGame = (games?.filter((item) => item.id === Number(gameid)))
    console.log(users.filter(user => user.id ===1)[0].username)
    // 
    function handleRoll() {
        if (currentGame[0].roundNumber === 0) {
            alert('invalid roll');
        } else {

        }
    }
    function handleSave() {
        if (currentGame[0].roundNumber === 0) {
            alert('invalid save');
        } else {

        }
    }

    return (
        <div>
            {currentGame?.map((item, i) =>
                <div key={i}><p>{item.id}</p>
                    <div>
                        <div>
                            <p>current turn:{users.filter(user => user.id === item.players.filter((player)=>Number(player.user_id)===1)[0].user_id)[0].username}</p>
                            <p>current score:{item.player_rounds.filter(round => round.player_id === item.players.filter((player)=>Number(player.id)===1)[0].id)[0].current_score}</p>
                            <DiceComponents gameData={item.rounds[0].rounds_players} />
                            {currentGame[0].roundNumber === 0 ? '' : <button onClick={handleRoll}>Roll</button>}
                            {currentGame[0].roundNumber === 0 ? '' : <button onClick={handleSave}>Save Score</button>}
                        </div>
                    </div>
                </div>)}
            <div>

                <div>
                    <div>
                        <div>
                            {/* score go here */}
                        </div>
                        <div>
                            {/* melds go here */}
                        </div>
                    </div>
                </div>
                <button>return to home</button>
            </div>
        </div>
    )
}