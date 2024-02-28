const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_GAME':
      return [...action.payload];
    case 'SET_LOCKED_DICE':
      let currentGameState = [...state];

      const diceChecked = action.payload.response.data.dice;
      let currentGame = action.payload.currentGame;
      const score = action.payload.response.data.score;
      const players = currentGame.players
      const currentPlayer = players.filter((player) => player.user_id === currentGame.current_turn)[0];

      for (let i = 0; i < 6; i++) {
        const propVal = `d${i + 1}_val`;
        const propLocked = `d${i + 1}_locked`;
        const propScored = `d${i + 1}_scored`;

        currentGame.rounds[0].rounds_players.find((rp) => rp.player_id === currentPlayer.user_id)[propVal] = diceChecked[i].value;
        currentGame.rounds[0].rounds_players.find((rp) => rp.player_id === currentPlayer.user_id)[propLocked] = diceChecked[i].locked;
        currentGame.rounds[0].rounds_players.find((rp) => rp.player_id === currentPlayer.user_id)[propScored] = diceChecked[i].scored;
      }

      currentGame.rounds[0].rounds_players[currentGame.rounds[0].rounds_players.length - 1].current_score += score;
      currentGameState[(currentGameState.findIndex(game => game.id === currentGame.id))] = currentGame;

      return currentGameState;

    default:
      return state;
  }
};


export default gamesReducer;