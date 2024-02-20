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
      applyThreeScore(0, tempScore, currentDice);
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
    let tempScore = 0;
    // 4 of any number
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      return 1000;
      // four of any number with pairs
    } else if (currentDice[0].value === currentDice[1].value && currentDice[2].value === currentDice[3].value) {
      return 1500;
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value) {
      applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we shift the first three items since they all match eachother
      // will this break the bottom if statement because it will have some things that are undefined?
      for (let i = 0; i < 3; i++) {
        currentDice.shift();
      }
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice.length > 3 && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we pop the last three items since they all match eachother
      for (let i = 0; i < 3; i++) {
        currentDice.pop();
      }
    } else {
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
  //FIVE LOCKED DICE
  else if (currentDice.length === 5) {
    let tempScore = 0;
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
      applyThreeScore(0, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we shift the first three items since they all match eachother
      // will this break the bottom if statement because it will have some things that are undefined?
      for (let i = 0; i < 3; i++) {
        currentDice.shift();
      }
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice.length > 3 && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value) {
      applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we pop the last three items since they all match eachother
      for (let i = 0; i < 3; i++) {
        currentDice.pop();
      }
      // this checks for a middle three pair match
    } else if (currentDice.length > 3 && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      applyThreeScore(2, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we grab the first and last items since the middle match eachother
      currentDice = currentDice.slice(0, 1).concat(currentDice.slice(4, 5));

    } else {
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
    let tempScore = 0;
    // 6 in a row
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
        currentDice = currentDice.slice(4, 5);
      } else if (endingIndex === 5) {
        currentDice = currentDice.slice(0, 1);
      }
      tempScore += 2000;
    } else if (currentDice.length > 1 && checkForXInRow(currentDice, 4).isPresent) {
      let endingIndex = checkForXInRow(currentDice, 4).endingIndex
      if (endingIndex === 3) {
        currentDice = currentDice.slice(3, 5);
      } else if (endingIndex === 4) {
        currentDice = currentDice.slice(0, 1).concat(currentDice.slice(4, 5));
      } else if (endingIndex === 5) {
        currentDice = currentDice.slice(0, 2);
      }
      tempScore += 1000;
    } else if (currentDice.length > 2 && checkForXInRow(currentDice, 3).isPresent) {
      let endingIndex = checkForXInRow(currentDice, 3).endingIndex
      if (endingIndex === 2) {
        applyThreeScore(2, tempScore, currentDice);
        currentDice = currentDice.slice(2, 5);
      } else if (endingIndex === 3) {
        applyThreeScore(3, tempScore, currentDice);
        currentDice = currentDice.slice(0, 1).concat(currentDice.slice(3, 5));
      } else if (endingIndex === 4) {
        applyThreeScore(4, tempScore, currentDice);
        currentDice = currentDice.slice(0, 2).concat(currentDice.slice(4, 5));
      } else if (endingIndex === 5) {
        applyThreeScore(5, tempScore, currentDice);
        currentDice = currentDice.slice(0, 3);
      }

      // checks to see if we have four in a row and trims the array for scoring accordingly
    } else {
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
// this function checks for x dice in a row out of 6 dice

function checkForXInRow(dice, amount) {
  let last = null;
  let count = 0;
  for (let i = 0; i < dice.length; i++) {
    if (dice[i] != last) {
      last = dice[i];
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
  // do i need to return tempscore then set tempscore = to this function? or by calling it as an input does that apply the score?
}

module.exports = router;
