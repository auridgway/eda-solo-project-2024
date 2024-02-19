import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function DashboardScreen() {
    const history = useHistory();

    return(
        <>
        <pre>in the dashboard</pre>
        <button onClick={()=>history.push('/game')}>push me to go to game</button>
        </>
    )
    }