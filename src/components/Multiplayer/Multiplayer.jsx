import { useSelector } from "react-redux"

export default function Multiplayer() {
    const games = useSelector(store => store.games);
    const joinableGames = games.filter((game) => game.status === 'created');
    return (
        <>
        <div>
            {joinableGames}
        </div>
        </>
    )
}