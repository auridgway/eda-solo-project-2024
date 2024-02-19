const diceInfoReducer = (state = [
    { value: 1, locked: false },
    { value: 2, locked: false },
    { value: 3, locked: false },
    { value: 4, locked: false },
    { value: 5, locked: false },
    { value: 6, locked: false }
], action) => {
    switch (action.type) {
        case 'LOCK_DICE':
            const newState = [...state];
            newState[action.payload.diceNumber].locked = true;
            return newState;
        case 'UNLOCK_DICE':
            const newerState = [...state];
            newerState[action.payload.diceNumber].locked = false;
            return newerState;
      default:
            return state;
    }
};


export default diceInfoReducer;