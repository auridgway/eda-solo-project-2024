import { useState } from "react"
import { useSelector } from "react-redux"
import DiceComponents from "../DiceComponent/DiceComponent"

export default function GameplayScreen() {
    // for gameplay screen the state we will need will include, the current score, and the dice to see if they are locked and 
    // their values
    const diceInfo = useSelector(store => store.diceInfo)



    return (
        <div>
            <div>
                <p>game id</p>
                <div>
                    <div>
                        <p>current score:</p>
                        <DiceComponents />
                        <pre>{JSON.stringify(diceInfo)}</pre>
                    </div>
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