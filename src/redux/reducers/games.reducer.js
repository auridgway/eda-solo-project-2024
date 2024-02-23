const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_GAME':
      return action.payload;
    case 'SET_LOCKED_DICE':
      let currentGameState = [...state];


      console.log(action.payload)
      const diceChecked = action.payload.response.data.dice;
      const score = action.payload.response.data.score;
      let currentGame = action.payload.currentGame;

      console.log(diceChecked);
      for (let i = 0; i < 6; i++) {
        const propVal = `d${i + 1}_val`;
        const propLocked = `d${i + 1}_locked`;
        const propScored = `d${i + 1}_scored`;

        currentGame.rounds[currentGame.rounds.length - 1].rounds_players[currentGame.rounds[currentGame.rounds.length - 1].rounds_players.length - 1][propVal] = diceChecked[i].value;
        currentGame.rounds[currentGame.rounds.length - 1].rounds_players[currentGame.rounds[currentGame.rounds.length - 1].rounds_players.length - 1][propLocked] = diceChecked[i].locked;
        currentGame.rounds[currentGame.rounds.length - 1].rounds_players[currentGame.rounds[currentGame.rounds.length - 1].rounds_players.length - 1][propScored] = diceChecked[i].scored;

      }
      currentGame.rounds[currentGame.rounds.length - 1].rounds_players[currentGame.rounds[currentGame.rounds.length - 1].rounds_players.length - 1].current_score = score;
      currentGameState[(currentGameState.findIndex(game => game.id === currentGame.id))] = currentGame;
      
      return currentGameState;

    default:
      return state;
  }
};


export default gamesReducer;