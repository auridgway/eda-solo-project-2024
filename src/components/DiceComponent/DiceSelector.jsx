import D1 from "./Dice/D1"
import D2 from "./Dice/D2"
import D3 from "./Dice/D3"
import D4 from "./Dice/D4"
import D5 from "./Dice/D5"
import D6 from "./Dice/D6"

export default function DiceSelector({ diceValue }) {

    console.log(diceValue)
    switch (diceValue) {
        case 1:
            return (<D1 />);
        case 2:
            return (<D2 />);
        case 3:
            return (<D3 />);
        case 4:
            return (<D4 />);
        case 5:
            return (<D5 />);
        case 6:
            return (<D6 />);
        default:
            return (<></>);
    }
}
