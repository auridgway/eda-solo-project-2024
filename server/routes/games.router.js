const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();

const { getGameById, getAllGames, createNewTurnByGameId } = require('../modules/queries');

// this will get the players active games when they are on the initial login dashboard screen
router.get('/user', rejectUnauthenticated, async (req, res) => {
  const allGames = await getAllGames();
  res.send(allGames);
});

// starts the game from hitting the start game button
router.put('/start/:gameId', rejectUnauthenticated, async (req, res) => {
  const testGame = req.query.testGame || false;
  // const gameId = req.body[0].id;
  const gameId = Number(req.params.gameId);

  try {
    const updatedGame = await createNewTurnByGameId(gameId, testGame);
    res.send(updatedGame);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// rolls current turn
router.post('/roll/:gameid', rejectUnauthenticated, async (req, res) => {
  const isBanked = req.query.bank || false; // ?bank=true or ?bank=false (default)
  console.log(req.query);
  console.log(isBanked);
  const gameId = Number(req.params.gameid);
  const dice = req.body; // [{value: 1, locked: true,}]

  console.log(dice);

  // TO TRACK SCORE WE NEED TO:
  //  1. Take our score from last turn ✅
  //  2. Calculate for the score for this turn ✅
  //  3. Combine them into the new current score
  //  4. Store it for next turn and apply that new variable to next roll
  //  5.

  try {
    // grabs current game
    const thisGame = await getGameById(gameId);
    const thisRound = thisGame.rounds[0]; // most recent round (which is this round)
    const myTurn = thisRound.rounds_players.find(rp => rp.player_id === req.user.id); // this user's current turn under this round
    console.log('this is my turn', myTurn);
    console.log('these are the dice we sent', dice);
    // const currentTurn = thisRound.rounds_players[thisGame.rounds[thisGame.rounds.length - 1].rounds_players.length - 1];

    // grabs score of current locked dice
    // [{value, locked, scored}]
    // STEP 1: CALCULATE THE SCORE OF LOCKED DICE
    myTurn.cumulative_score = myTurn.current_score;
    let lastScore = myTurn.cumulative_score;
    let lockedScore = checkMelds(dice); // assumes that frontend is correct with scored/locked values
    console.log(`Locked Score:`, lockedScore);
    // wants turn object with d1_val, d2_val d3_val

    // STEP 2: MARK LOCKED DICE AS SCORED
    for (let i = 0; i < 6; i++) {
      const propVal = `d${i + 1}_val`;
      const propLocked = `d${i + 1}_locked`;
      const propScored = `d${i + 1}_scored`;

      // update this turn's state: lock dice, set as scored
      myTurn[propVal] = dice[i].value;
      myTurn[propLocked] = dice[i].locked;
      myTurn[propScored] = dice[i].locked;
    }
    console.log('after setting turn', myTurn)
    // console.log(`dice values`, myTurn);
    // STEP 3: RE-ROLL ALL UNLOCKED DICE, ASSUMING WE CAN STILL PLAY (NO FARKLE)
    let diceValues = randomizeDice(myTurn); // marking as scored, re-rolling unlocked dice
    // let updatedTurn = getGame;

    // turn any locked dice into scored dice
    // check for farkle
    // update turn in database

    // STEP 4: UPDATE THE DATABASE WITH THE SCORE, NEW DICE VALUES AND STATUS
    if (!isBanked) {
      console.log(`--> Player is not banking`)
      // only save re-rolled dice is we're not banking the score
      for (let i = 0; i < 6; i++) {
        const propVal = `d${i + 1}_val`;
        myTurn[propVal] = diceValues[i].value;
      }
      let scoredAll = false;
      let tempArr = [];
      for (let i = 0; i < 6; i++) {
        const propVal = `d${i + 1}_scored`;
        tempArr.push(myTurn[propVal]);
      }
      if (!tempArr.includes(false)) {
        scoredAll = true;
      }
      // we see if they've farkled based on the dice they lock in/roll and if so then we apply that here
      const meldCheck = checkMelds(diceValues, true);
      if (meldCheck === 0 && scoredAll === false) {
        myTurn.farkle = true;
        myTurn.has_played = true;
        myTurn.current_score = 0;
        myTurn.cumulative_score = 0;
        console.log(`Sorry, you farkled. Score of ${lockedScore} lost`);
      } else if (scoredAll === true) {
        scoredAll = false;
        // STRETCH: Add unlock for all dice scored

        myTurn.current_score = lastScore + lockedScore;
        console.log(`Score of ${lockedScore} saved due to lucky roll (no farkle)`);
      } else {
        myTurn.current_score = lastScore + lockedScore;
        console.log(`Score of ${lockedScore} saved due to lucky roll (no farkle)`);
      }
      myTurn.rolls += 1;
    } else {
      // player banked the rolls, so lets move on
      // set the score, set the has_played
      console.log(`--> Player is banking`)
      myTurn.current_score = lastScore + lockedScore;
      console.log(`Score of ${lockedScore} saved due to lucky roll (no farkle)`);
      myTurn.has_played = true;
    }

    const sql = `UPDATE rounds_players
    SET 
        d1_val = $3,
        d1_locked = $4,
        d2_val = $5,
        d2_locked = $6,
        d3_val = $7,
        d3_locked = $8,
        d4_val = $9,
        d4_locked = $10,
        d5_val = $11,
        d5_locked = $12,
        d6_val = $13,
        d6_locked = $14,
        current_score = $15,
        rolls = $16,
        farkle = $17,
        has_played = $18,
        d1_scored = $19,
        d2_scored = $20,
        d3_scored = $21,
        d4_scored = $22,
        d5_scored = $23,
        d6_scored = $24,
        cumulative_score = $25
    WHERE round_id = $1 AND player_id = $2 RETURNING *;`;

    const finalResult = await pool.query(sql, [
      myTurn.round_id, myTurn.player_id,
      myTurn.d1_val, myTurn.d1_locked,
      myTurn.d2_val, myTurn.d2_locked,
      myTurn.d3_val, myTurn.d3_locked,
      myTurn.d4_val, myTurn.d4_locked,
      myTurn.d5_val, myTurn.d5_locked,
      myTurn.d6_val, myTurn.d6_locked,
      myTurn.current_score, myTurn.rolls,
      myTurn.farkle, myTurn.has_played,
      myTurn.d1_scored, myTurn.d2_scored,
      myTurn.d3_scored, myTurn.d4_scored,
      myTurn.d5_scored, myTurn.d6_scored,
      myTurn.cumulative_score,
    ]);

    if (myTurn.has_played) {
      // we have either farkled OR banked, either way we're done
      // record score, see if we won
      // ALSO: update this game's current player's turn id
      const sql3 = `update "games" set "status" = 'completed', "winner_id" = $1 where "id"=$2 returning *`;
      const sql2 = `update players set score = score + $1 where user_id = $2 and game_id=$3 returning *;`;
      const sql = `select * from rounds_players where round_id = $1 and has_played = false`;
      const sql4 = `update games set current_turn = $1 where id=$2 returning *`
      // update score
      const updatedScoreResult = await pool.query(sql2, [myTurn.current_score, myTurn.player_id, gameId])
      // check for if win game
      if (updatedScoreResult.rows[0].score >= 10000) {
        // if win, win game - only partially updates db with player_id, even with hardcoded 'completed in there'
        const gameWinResult = await pool.query(sql3, [myTurn.player_id, gameId]);
        console.log(myTurn.player_id)
        console.log(gameId)
        console.log(gameWinResult.rows)
      } else {
        // select players, joined on rounds_players? then try to see whose turn it is next based on game
        const selectPlayersResult = await pool.query(sql, [myTurn.round_id]);
        const nextPlayer = selectPlayersResult.rows.filter((player) => player.has_played === false)
        console.log(nextPlayer.length);
        if (nextPlayer.length > 0) {
          const nextPlayerResult = await pool.query(sql4, [nextPlayer[0].player_id, gameId]);
        }
      }
    }

    const finalUpdatedGame = await getGameById(gameId);
    const finalTurn = finalUpdatedGame.rounds[0].rounds_players;
    if (finalTurn.some(rp => rp.has_played === false)) {
      // still have people to play
    } else {
      // everyone has played
      // INSERT NEW ROUND
      // ROLL NEW DICE FOR EACH PLAYER, ETC.
      console.log(`All players have taken their turn, making new turn`);
      const updatedGame = await createNewTurnByGameId(gameId);
      res.send(updatedGame);
      return;
    }

    // OK turn is done being processed. Now:
    //  If the player's turn is over (banked or farkle):
    //    1. Record the final score on the other table
    //    2. Check to see if the game is finished (total score > 10000)
    //  If this player's turn is the last one left:
    //    1. Create a new Round, RoundsPlayer entry (re-roll dice for all players)
    //      (insert new record, roll 6 dice, default values, etc) for each player
    res.send((await getGameById(gameId)));
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/lock/', rejectUnauthenticated, (req, res) => {
  // POST route code here
  // req.body NEEDS to be in this format [{values: x, locked: x, scored: x}, ...] just send all dice when you send this request
  const diceValues = req.body;
  console.log(diceValues);
  // 0 means no scoring and anything else means your dice scored - a zero score will reflect on the clients end
  res.send({ score: checkMelds(diceValues), dice: diceValues });

});

function checkMelds(diceValues, checkUnScored = false) {
  // dicevalues [{value, locked}...]
  // grabs the locked dice and filters them by values 1-6
  let currentDice = diceValues.filter((dice) => (!checkUnScored) ? dice.locked === true && dice.scored === false : dice.scored === false)
    .sort((a, b) => {
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
  //THREE LOCKED DICE [1,1,4,4,4]
  if (currentDice.length === 3) {
    console.log('dice at this thing',currentDice);
    if ((currentDice[0].value === currentDice[1].value) && (currentDice[1].value === currentDice[2].value)) {
      return applyThreeScore(2, tempScore, currentDice);
    }
    //FOUR LOCKED DICE
  } else if (currentDice.length === 4) {
    // 4 of any number
    if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value && currentDice[2].value === currentDice[3].value) {
      return 1000;
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value) {
      tempScore += applyThreeScore(1, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we shift the first three items since they all match eachother
      // will this break the bottom if statement because it will have some things that are undefined?
      for (let i = 0; i < 3; i++) {
        currentDice.shift();
      }
      console.log('dice after shift', currentDice)
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
      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice[0].value === currentDice[1].value && currentDice[1].value === currentDice[2].value) {
      tempScore += applyThreeScore(2, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we shift the first three items since they all match eachother
      // will this break the bottom if statement because it will have some things that are undefined?
      for (let i = 0; i < 3; i++) {
        currentDice.shift();
      }
      console.log('dice after shift', currentDice)

      // checks to see if we have a pair of 3 in a row as well as any 5's or 1's
    } else if (currentDice.length > 3 && currentDice[2].value === currentDice[3].value && currentDice[3].value === currentDice[4].value) {
      tempScore += applyThreeScore(2, tempScore, currentDice);
      // if any of these above match we don't want to add on additional points so we pop the last three items since they all match eachother
      for (let i = 0; i < 3; i++) {
        currentDice.pop();
      }
      console.log('dice after pop', currentDice)

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
      // four in a row including a pair
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
  console.log('score before final calculations', tempScore)

  console.log('dice', currentDice);
  for (const dice of currentDice) {
    if (dice.value === 1) {
      tempScore += 100;
    } else if (dice.value === 5) {
      tempScore += 50;
    }
  }
  console.log('score after calculations', tempScore)
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

function randomizeDice(diceValues) {
  let tempValues = diceValues
  console.log('randomize dice function values', diceValues);
  if (diceValues.d1_locked === false && diceValues.d1_scored === false) {
    diceValues.d1_val = rollDice();
  } else if (diceValues.d1_locked === true && diceValues.d1_scored === false) {
    diceValues.d1_scored = true;
  }
  if (!diceValues.d2_locked && !diceValues.d2_scored) {
    diceValues.d2_val = rollDice();
  } else if (diceValues.d2_locked === true && diceValues.d2_scored === false) {
    diceValues.d2_scored = true;
  }
  if (!diceValues.d3_locked && !diceValues.d3_scored) {
    diceValues.d3_val = rollDice();
  } else if (diceValues.d3_locked === true && diceValues.d3_scored === false) {
    diceValues.d3_scored = true;
  }
  if (!diceValues.d4_locked && !diceValues.d4_scored) {
    diceValues.d4_val = rollDice();
  } else if (diceValues.d4_locked === true && diceValues.d4_scored === false) {
    diceValues.d4_scored = true;
  }
  if (!diceValues.d5_locked && !diceValues.d5_scored) {
    diceValues.d5_val = rollDice();
  } else if (diceValues.d5_locked === true && diceValues.d5_scored === false) {
    diceValues.d5_scored = true;
  }
  if (!diceValues.d6_locked && !diceValues.d6_scored) {
    diceValues.d6_val = rollDice();
  } else if (diceValues.d6_locked === true && diceValues.d6_scored === false) {
    diceValues.d6_scored = true;
  }

  tempValues = [
    { value: diceValues.d1_val, locked: diceValues.d1_locked, scored: diceValues.d1_scored, },
    { value: diceValues.d2_val, locked: diceValues.d2_locked, scored: diceValues.d2_scored, },
    { value: diceValues.d3_val, locked: diceValues.d3_locked, scored: diceValues.d3_scored, },
    { value: diceValues.d4_val, locked: diceValues.d4_locked, scored: diceValues.d4_scored, },
    { value: diceValues.d5_val, locked: diceValues.d5_locked, scored: diceValues.d5_scored, },
    { value: diceValues.d6_val, locked: diceValues.d6_locked, scored: diceValues.d6_scored, },
  ]
  console.log('randomize dice function values ending', tempValues);

  return tempValues;
}

function rollDice() {
  return Math.ceil(Math.random() * 6);
}

module.exports = router;
