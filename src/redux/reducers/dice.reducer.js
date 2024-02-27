const diceReducer = (state = [ 
    { value: 1, locked: false, scored: false },
    { value: 2, locked: false, scored: false },
    { value: 3, locked: false, scored: false },
    { value: 4, locked: false, scored: false },
    { value: 5, locked: false, scored: false },
    { value: 6, locked: false, scored: false },
], action) => {
    switch (action.type) {
      case 'SET_DICE':
        return action.payload;
      default:
        return state;
    }
  };

  
  export default diceReducer;

  