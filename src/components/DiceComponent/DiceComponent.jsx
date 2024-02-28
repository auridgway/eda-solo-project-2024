import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function getCurrentTurn(thisGame) {
    const players = thisGame.players;
    const currentPlayer = players.find((player) => player.user_id === thisGame.current_turn);
    const roundsArray = thisGame.rounds;
    const currentRound = roundsArray[0];
    const turnsArray = currentRound.rounds_players;
    const currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer.user_id);
    return currentTurn;
}

export default function DiceComponent(props) {

    const games = useSelector(store => store.games);
    const diceInfo = useSelector(store => store.dice);
    const dispatch = useDispatch();
    const gameid = props.gameId;

    const currentGame = games.find(game => game.id === Number(gameid));

    if (currentGame === undefined || games.length <= 0) {
        return <h1>Loading...</h1>
    }

    const currentTurn = getCurrentTurn(currentGame);

    // const [currentGame, setCurrentGame] = useState([]);
    // const [currentTurn, setCurrentTurn] = useState([]);

    // useEffect(() => {
    //     setCurrentGame(games?.filter((item) => item.id === Number(props.gameId))[0])
    //     setCurrentTurn(drill());
    // }, [JSON.stringify(games)])

    // useEffect(() => {
    //     console.log(currentTurn);
    //     if (currentTurn === undefined) {

    //     } else {
    //         console.log(JSON.stringify(currentTurn))
    //         const action = {
    //             type: 'SET_DICE', payload: [
    //                 { value: currentTurn.d1_val, locked: currentTurn.d1_locked, scored: currentTurn.d1_scored },
    //                 { value: currentTurn.d2_val, locked: currentTurn.d2_locked, scored: currentTurn.d2_scored },
    //                 { value: currentTurn.d3_val, locked: currentTurn.d3_locked, scored: currentTurn.d3_scored },
    //                 { value: currentTurn.d4_val, locked: currentTurn.d4_locked, scored: currentTurn.d4_scored },
    //                 { value: currentTurn.d5_val, locked: currentTurn.d5_locked, scored: currentTurn.d5_scored },
    //                 { value: currentTurn.d6_val, locked: currentTurn.d6_locked, scored: currentTurn.d6_scored },]
    //         }
    //         dispatch(action);
    //     }
    // }, [currentTurn]);

    // function drill() {
    //     if (games.length <= 0) {
    //         return [];
    //     } else {
    //         const players = games[games.findIndex((item) => item.id === Number(props.gameId))].players
    //         const currentPlayer = players.filter((player) => player.user_id === currentGame.current_turn)[0];
    //         let roundsArray = games[games.findIndex((item) => item.id === Number(props.gameId))].rounds;
    //         let currentRound = roundsArray[0];
    //         let turnsArray = currentRound.rounds_players;
    //         let currentTurn = turnsArray.find((rp) => rp.player_id === currentPlayer.user_id);
    //         return currentTurn;
    //     }
    // }

    // when this gets clicked we need to do these things
    // 1. 
    function handleClick(key) {
        let tempDice = diceInfo;
        if (diceInfo[key].scored === false && diceInfo[key].locked === false) {
            tempDice[key].locked = true;
            const action = {
                type: 'ADJUST_DICE',
                payload: {
                    tempDice: [
                        { value: currentTurn.d1_val, locked: currentTurn.d1_locked, scored: currentTurn.d1_scored },
                        { value: currentTurn.d2_val, locked: currentTurn.d2_locked, scored: currentTurn.d2_scored },
                        { value: currentTurn.d3_val, locked: currentTurn.d3_locked, scored: currentTurn.d3_scored },
                        { value: currentTurn.d4_val, locked: currentTurn.d4_locked, scored: currentTurn.d4_scored },
                        { value: currentTurn.d5_val, locked: currentTurn.d5_locked, scored: currentTurn.d5_scored },
                        { value: currentTurn.d6_val, locked: currentTurn.d6_locked, scored: currentTurn.d6_scored }],
                    currentGame
                }
            }
            dispatch(action);
        } else if (diceInfo[key].scored === false && diceInfo[key].locked === true) {
            tempDice[key].locked = false;
            const action = {
                type: 'ADJUST_DICE',
                payload: {
                    tempDice: [
                        { value: currentTurn.d1_val, locked: currentTurn.d1_locked, scored: currentTurn.d1_scored },
                        { value: currentTurn.d2_val, locked: currentTurn.d2_locked, scored: currentTurn.d2_scored },
                        { value: currentTurn.d3_val, locked: currentTurn.d3_locked, scored: currentTurn.d3_scored },
                        { value: currentTurn.d4_val, locked: currentTurn.d4_locked, scored: currentTurn.d4_scored },
                        { value: currentTurn.d5_val, locked: currentTurn.d5_locked, scored: currentTurn.d5_scored },
                        { value: currentTurn.d6_val, locked: currentTurn.d6_locked, scored: currentTurn.d6_scored }],
                    currentGame
                }
            }
            dispatch(action);
        } else {
            alert('Cannot unlock already scored dice!');
        }
    }
    // allow users to send off bad melds and let the server respond with if it's good or bad
    // let server check for all melds at start
    // let server check for farkles
    return (
        <>
            {diceInfo?.map((item, i) =>
                <div key={i}>
                    <p onClick={() => handleClick(i)}>{item.locked === false ? '🔓' : '🔒'}</p>
                    <p>{item.value}</p>
                </div>)}
        </>
    )
}