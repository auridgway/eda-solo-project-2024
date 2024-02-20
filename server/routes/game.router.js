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
router.get('/user', (req, res) => {
  // GET route code here
  const sql = `select * from games
  join players on players.game_id = games.id
  join rounds on rounds.game_id = games.id where user_id = 1;`
  //const id = req.params.id

  pool.query(sql).then((result) => {
    res.send(result.rows)
  }).catch((err) => console.log(err));
});

/**
 * POST route template
 */
router.post('/turn/:turnNumber', (req, res) => {
  // POST route code here


});

function checkMelds(diceValues) {
  // grabs the locked dice and filters them by values 1-6
  const currentDice = diceValues.filter((dice) => dice.locked === true).sort();
  // checks to see if we only have one current dice. if so we see if it equals 1 or 5 then return their meld values
  //ONE LOCKED DICE
  if (currentDice.length === 1) {
    if (currentDice[0].value === 1) {
      return 100;
    } else if (currentDice[0].value === 5) {
      return 50;
    } else {
      return 'No Melds';
    }
    //TWO LOCKED DICE
  } else if (currentDice.length === 2) {
    let tempScore = 0;
    for (const dice of currentDice) {
      if (dice.value === 1) {
        tempScore += 100;
      } else if (dice.value === 5) {
        tempScore += 50;
      }
    }
    if (tempScore === 0) {
      return 'No Melds'
    } else {
      return tempScore;
    }
    //THREE LOCKED DICE
  } else if (currentDice.length === 3) {
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value) {
      if (currentDice[0].value === 1) {
        return 300;
      } else if (currentDice[0].value === 2) {
        return 200;
      } else if (currentDice[0].value === 3) {
        return 300;
      } else if (currentDice[0].value === 4) {
        return 400;
      } else if (currentDice[0].value === 5) {
        return 500;
      } else if (currentDice[0].value === 6) {
        return 600;
      }
    } else {
      let tempScore = 0;
      for (const dice of currentDice) {
        if (dice.value === 1) {
          tempScore += 100;
        } else if (dice.value === 5) {
          tempScore += 50;
        }
      }
      if (tempScore === 0) {
        return 'No Melds'
      } else {
        return tempScore;
      }
    }
    //FOUR LOCKED DICE
  } else if (currentDice.length === 4) {
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      return 1000;
    } else {
      let tempScore = 0;
      for (const dice of currentDice) {
        if (dice.value === 1) {
          tempScore += 100;
        } else if (dice.value === 5) {
          tempScore += 50;
        }
      }
      if (tempScore === 0) {
        return 'No Melds'
      } else {
        return tempScore;
      }
    }
    //FIVE LOCKED DICE
  } else if (currentDice.length === 5) {
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value) {
      return 2000;
    } else {
      let tempScore = 0;
      for (const dice of currentDice) {
        if (dice.value === 1) {
          tempScore += 100;
        } else if (dice.value === 5) {
          tempScore += 50;
        }
      }
      if (tempScore === 0) {
        return 'No Melds'
      } else {
        return tempScore;
      }
    }
    //SIX LOCKED DICE
  } else if (currentDice.length === 6) {
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value && currentDice[4].value === currentDice[5].value) {
      return 3000;
    } else {
      let tempScore = 0;
      for (const dice of currentDice) {
        if (dice.value === 1) {
          tempScore += 100;
        } else if (dice.value === 5) {
          tempScore += 50;
        }
      }
      if (tempScore === 0) {
        return 'No Melds'
      } else {
        return tempScore;
      }
    }
  }
}

module.exports = router;
