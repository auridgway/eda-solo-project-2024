const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


// Game Logic
// people will attempt to join a game using a post to players - if there are more than 8 don't allow anymore people in the game
// user will hit start game and send off a put to update the gamestate (if there is only one person, reject this request)
// check if all players have played this turn. if so...
// ...post to rounds to increment the round post to rounds_players to initalize first turn (since they start at 0)
// roll 6 random numbers for current turn
// let server check for all melds at start
// let server check for farkles - if farkle send back farkle true/false
// if they've scored off the first roll with all six send the info back, and ask them to roll again or save score
// allow users to send off bad melds and let the server respond with if it's good or bad
// check to see if current turn is saving their score then post the score accordingly and send back user info (reply with the same object we send to redux)
// if they've farkled or saved their score then continue on to the next player and mark them as having their turn taken



/**
 * GET route template
 */
// this will get the players active games when they are on the initial login dashboard screen
router.get('/user/', (req, res) => {
  // GET route code here
  const sql = `select games.id, games.time as "created_at", games.winner_id, games.status, games.owner_id, players.user_id as 
  user_in_game, players.user_resigned, games.lobby_name, games.passphrase, rounds.id as round_id, rounds.round_number, 
  rounds_players.player_id as current_player, rounds_players.current_score, rounds_players.has_played, rounds_players.rolls, 
  rounds_players.farkle, rounds_players.d1_locked, rounds_players.d1_val, rounds_players.d2_locked, rounds_players.d2_val, 
  rounds_players.d3_locked, rounds_players.d3_val, rounds_players.d4_locked, rounds_players.d4_val, rounds_players.d5_locked, 
  rounds_players.d5_val, rounds_players.d6_locked, rounds_players.d6_val  from games
  join players on players.game_id = games.id
  join rounds on rounds.game_id = games.id
  join rounds_players on player_id=players.id;`
  // use this in future to add id
  // where user_id = 1
  // const id = req.params.id

  pool.query(sql).then((result) => {
    console.log(checkMelds(diceValues));
    res.send(result.rows)
  }).catch((err) => console.log(err));
});

/**
 * POST route template
 */
// this is called when people click the save score button
router.post('/turn/:gameId', (req, res) => {
  // POST route code here


});

router.post('/lock', (req, res) => {
  // POST route code here
  // req.body NEEDS to be in this format [{values: x, locked: x}, ...] just send all dice when you send this request
  const diceValues = req.body;

  // 0 means no scoring and anything else means your dice scored
  res.send({score:checkMelds(diceValues),dice:diceValues});

});
// test data for melds
// returns 3000 as it should - const diceValues = [{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},];
// returns 150 as it should - const diceValues = [{value: 1, locked: true},{value: 5, locked: true},{value: 3, locked: false},{value: 3, locked: false},{value: 3, locked: false},{value: 3, locked: false},];
// returns 1500 as it should - const diceValues = [{value: 1, locked: true},{value: 2, locked: true},{value: 3, locked: true},{value: 4, locked: true},{value: 5, locked: true},{value: 6, locked: true},];
// returns 450 as it should - const diceValues = [{ value: 3, locked: true }, { value: 3, locked: true }, { value: 3, locked: true }, { value: 5, locked: true }, { value: 1, locked: true }, { value: 3, locked: false },];
// returns 1500 as it should - const diceValues = [{ value: 2, locked: true }, { value: 2, locked: true }, { value: 3, locked: true }, { value: 3, locked: true }, { value: 3, locked: true }, { value: 3, locked: true },];
// returns 1150 as it should - const diceValues = [{ value: 1, locked: true }, { value: 2, locked: true }, { value: 2, locked: true }, { value: 2, locked: true }, { value: 2, locked: true }, { value: 5, locked: true },];
// returns 500 as it should - const diceValues = [{ value: 3, locked: true }, { value: 3, locked: true }, { value: 3, locked: true }, { value: 1, locked: true }, { value: 5, locked: true }, { value: 5, locked: true },];

function checkMelds(diceValues) {
  // dicevalues [{value, locked}...]
  // grabs the locked dice and filters them by values 1-6
  let currentDice = diceValues.filter((dice) => dice.locked === true).sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    } else if (a.value > b.value) {
      return 1;
    } else {
      return 0;
    }
  });
  let tempScore = 0;
  // checks to see if we only have one current dice. if so we see if it equals 1 or 5 then return their meld values
  //ONE LOCKED DICE - will flow to bottom to be taken care of
  //TWO LOCKED DICE - will flow to bottom to be taken care of
  //THREE LOCKED DICE
  if (currentDice.length === 3) {
    if ((currentDice[0].value === currentDice[1].value) && (currentDice[1].value === currentDice[2].value)) {
      return applyThreeScore(0, tempScore, currentDice);
    }
    //FOUR LOCKED DICE
  } else if (currentDice.length === 4) {
    // 4 of any number
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      return 1000;
      // four of any number with pairs
    } else if (currentDice[0].value === currentDice[1].value && currentDice[2].value === currentDice[3].value) {
      return 1500;
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value) {
      tempScore += applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we shift the first three items since they all match eachother
      // will this break the bottom if statement because it will have some things that are undefined?
      for (let i = 0; i < 3; i++) {
        currentDice.shift();
      }
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice.length > 3 && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      tempScore += applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we pop the last three items since they all match eachother
      for (let i = 0; i < 3; i++) {
        currentDice.pop();
      }
    }
  }
  //FIVE LOCKED DICE
  else if (currentDice.length === 5) {
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value) {
      return 2000;
      // 4 of any number
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      tempScore += 1000;
      // four of any number with pairs
    } else if (currentDice[0].value === currentDice[1].value && currentDice[2].value === currentDice[3].value) {
      tempScore += 1500;
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value) {
      tempScore += applyThreeScore(0, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we shift the first three items since they all match eachother
      // will this break the bottom if statement because it will have some things that are undefined?
      for (let i = 0; i < 3; i++) {
        currentDice.shift();
      }
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice.length > 3 && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value) {
      tempScore += applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we pop the last three items since they all match eachother
      for (let i = 0; i < 3; i++) {
        currentDice.pop();
      }
      // this checks for a middle three pair match
    } else if (currentDice.length > 3 && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      tempScore += applyThreeScore(2, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we grab the first and last items since the middle match eachother
      currentDice = currentDice.slice(0, 1).concat(currentDice.slice(4, 5));
    }
    //SIX LOCKED DICE
  } else if (currentDice.length === 6) {
    // 6 in a row
    console.log('inside outside statement', checkForXInRow(currentDice, 4).isPresent)

    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value && currentDice[4].value === currentDice[5].value) {
      return 3000;
      // a straight 1-6
    } else if (currentDice[0].value === 1 && currentDice[1].value === 2 && currentDice[2].value === 3 && currentDice[3].value === 4 && currentDice[4].value === 5 && currentDice[5].value === 6) {
      return 1500;
      // three pairs
    } else if (currentDice[0].value === currentDice[1].value && currentDice[2].value === currentDice[3].value && currentDice[4].value === currentDice[5].value) {
      return 1500;
      // two triplets
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[3].value === currentDice[4].value && currentDice[4].value === currentDice[5]) {
      return 2500;
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value && currentDice[4].value === currentDice[5].value || currentDice[0].value === currentDice[1].value && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value && currentDice[4].value === currentDice[5].value) {
      return 1500;
      // here we see if there are three in a row anywhere then remove them from the current dice so they don't get scored again
    } else if (checkForXInRow(currentDice, 5).isPresent) {
      let endingIndex = checkForXInRow(currentDice, 5).endingIndex
      if (endingIndex === 4) {
        currentDice = currentDice.slice(5, 6);
      } else if (endingIndex === 5) {
        currentDice = currentDice.slice(0, 1);
      }
      tempScore += 2000;
    } else if (currentDice.length > 1 && checkForXInRow(currentDice, 4).isPresent) {
      console.log('inside if statement', checkForXInRow(currentDice, 4).endingIndex)
      let endingIndex = checkForXInRow(currentDice, 4).endingIndex
      if (endingIndex === 3) {
        currentDice = currentDice.slice(4, 6);
      } else if (endingIndex === 4) {
        currentDice = currentDice.slice(0, 1).concat(currentDice.slice(5, 6));
      } else if (endingIndex === 5) {
        currentDice = currentDice.slice(0, 2);
      }
      tempScore += 1000;
    } else if (currentDice.length > 2 && checkForXInRow(currentDice, 3).isPresent) {
      let endingIndex = checkForXInRow(currentDice, 3).endingIndex
      if (endingIndex === 2) {
        tempScore += applyThreeScore(2, tempScore, currentDice);
        currentDice = currentDice.slice(3, 6);
      } else if (endingIndex === 3) {
        tempScore += applyThreeScore(3, tempScore, currentDice);
        currentDice = currentDice.slice(0, 1).concat(currentDice.slice(3, 6));
      } else if (endingIndex === 4) {
        tempScore += applyThreeScore(4, tempScore, currentDice);
        currentDice = currentDice.slice(0, 2).concat(currentDice.slice(4, 6));
      } else if (endingIndex === 5) {
        tempScore += applyThreeScore(5, tempScore, currentDice);
        currentDice = currentDice.slice(0, 3);
      }
      // checks to see if we have four in a row and trims the array for scoring accordingly
    }
  }
  for (const dice of currentDice) {
    if (dice.value === 1) {
      tempScore += 100;
    } else if (dice.value === 5) {
      tempScore += 50;
    }
  }
  return tempScore;
}
// this function checks for x dice in a row out of 6 dice

function checkForXInRow(dice, amount) {
  let last = null;
  let count = 0;
  for (let i = 0; i < dice.length; i++) {
    if (dice[i].value != last) {
      last = dice[i].value;
      count = 0;
    }
    count += 1;
    if (amount <= count) {
      return { isPresent: true, endingIndex: i };
    }
  }
  return { isPresent: false };
}

function applyThreeScore(index, tempScore, currentDice) {
  if (currentDice[index].value === 1) {
    tempScore += 300;
  } else if (currentDice[index].value === 2) {
    tempScore += 200;
  } else if (currentDice[index].value === 3) {
    tempScore += 300;
  } else if (currentDice[index].value === 4) {
    tempScore += 400;
  } else if (currentDice[index].value === 5) {
    tempScore += 500;
  } else if (currentDice[index].value === 6) {
    tempScore += 600;
  }
  return tempScore;
  // do i need to return tempscore then set tempscore = to this function? or by calling it as an input does that apply the score?
}

module.exports = router;
