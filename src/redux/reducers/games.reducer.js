const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_GAME':
      return action.payload;
    case 'SET_LOCKED_DICE':
      let currentGameState = [...state];

      const diceChecked = action.payload.dice;

      if (action.payload.score === 0) {
        return [...state];
      } else {
        
      }


    default:
      return state;
  }
};


export default gamesReducer;