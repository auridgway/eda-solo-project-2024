const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * GET route template
 */
// this will get the players active games when they are on the initial login dashboard screen
router.get('/user', (req, res) => {

  const sql = `
  SELECT *,
	(SELECT coalesce(jsonb_agg(item), '[]'::jsonb) FROM (
		SELECT *, 
			(SELECT coalesce(jsonb_agg(item2), '[]'::jsonb) FROM (
				SELECT * FROM "rounds_players" WHERE "rounds_players"."round_id"="rounds"."id"
			) item2) as "rounds_players"
		FROM "rounds" WHERE "rounds"."game_id"="games"."id" ORDER BY "rounds"."round_number" DESC)
		item) as "rounds",
	(SELECT coalesce(jsonb_agg(item), '[]'::jsonb) FROM (SELECT "players".*, "user"."username" FROM "players" 
JOIN "user" ON "user"."id" = "players"."user_id" WHERE "players"."game_id"="games"."id") item) as "players"
	from "games";`

  pool.query(sql).then((result) => {
    res.send(result.rows)
  }).catch((err) => console.log(err));
});

// starts the game from hitting the start game button
router.post('/start/:gameId', rejectUnauthenticated, async (req, res) => {
  // set game to inprogress
  const sql = `update games set status = 'inprogress' where id = $1;`;

  const gameId = req.params.gameId;
  try {
    await pool.query(sql, [gameId]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// sets a new turn
router.post('/turn/', rejectUnauthenticated, (req, res) => {
  // put route code here
  const gameData = req.body;
  let newGameData = gameData;
  let playerInfo = [];

  if (gameData.status !== 'inprogess') {
    res.send({ error: 'game is not in progress' }).status(400);
  } else {
    // trying to grab player info to see if all players have played?
    const getPlayers = `select * from "players" where game_id=$1 order by joined_at asc;`;
    // get our current player information
    pool.query(getPlayers, [req.params.gameId]).then((result) => {
      playerInfo = result.rows;
    }).catch((error) => console.log(error));

    if (playerInfo === undefined) {
      console.error('Players info not found.')
    }

  }
});

// rolls current turn
router.post('/roll/', rejectUnauthenticated, (req, res) => {
  console.log('in roll')
  const currentGame = req.body;
  const currentTurn = currentGame.rounds[currentGame.rounds.length - 1].rounds_players[currentGame.rounds[currentGame.rounds.length - 1].rounds_players.length - 1];
  console.log(currentTurn);
  let updatedTurn = currentTurn;



  // roll our new dice and set the values accordingly
  let diceValues = randomizeDice(updatedTurn);
  // diceValues = [
  //   { value: updatedTurn.d1_val, locked: updatedTurn.d1_locked, scored: updatedTurn.d1_scored, },
  //   { value: updatedTurn.d2_val, locked: updatedTurn.d2_locked, scored: updatedTurn.d2_scored, },
  //   { value: updatedTurn.d3_val, locked: updatedTurn.d3_locked, scored: updatedTurn.d3_scored, },
  //   { value: updatedTurn.d4_val, locked: updatedTurn.d4_locked, scored: updatedTurn.d4_scored, },
  //   { value: updatedTurn.d5_val, locked: updatedTurn.d5_locked, scored: updatedTurn.d5_scored, },
  //   { value: updatedTurn.d6_val, locked: updatedTurn.d6_locked, scored: updatedTurn.d6_scored, },
  // ]
  for (let i = 0; i < 6; i++) {
    const propVal = `d${i + 1}_val`;
    const propLocked = `d${i + 1}_locked`;
    const propScored = `d${i + 1}_scored`;

    updatedTurn[propVal] = diceValues[i].value;
    updatedTurn[propLocked] = diceValues[i].locked;
    updatedTurn[propScored] = diceValues[i].scored;
  }
  // we see if they've farkled based on the dice they lock in/roll and if so then we apply that here
  if (checkMelds(diceValues) === 0) {
    updatedTurn.farkle = true;
    updatedTurn.has_played = true
    updatedTurn.current_score = 0;
  } else {
    updatedTurn.current_score = checkMelds(diceValues);
  }
  updatedTurn.rolls += 1;


  const sql = `insert into rounds_players ("round_id","player_id","d1_val","d1_locked","d2_val","d2_locked","d3_val","d3_locked","d4_val","d4_locked","d5_val","d5_locked","d6_val","d6_locked","current_score","rolls","farkle","has_played","d1_scored","d2_scored","d3_scored","d4_scored","d5_scored","d6_scored")
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`;

  pool.query(sql, [
    updatedTurn.round_id, updatedTurn.player_id,
    updatedTurn.d1_val, updatedTurn.d1_locked,
    updatedTurn.d2_val, updatedTurn.d2_locked,
    updatedTurn.d3_val, updatedTurn.d3_locked,
    updatedTurn.d4_val, updatedTurn.d4_locked,
    updatedTurn.d5_val, updatedTurn.d5_locked,
    updatedTurn.d6_val, updatedTurn.d6_locked,
    updatedTurn.current_score, updatedTurn.rolls,
    updatedTurn.farkle, updatedTurn.has_played,
    updatedTurn.d1_scored, updatedTurn.d2_scored,
    updatedTurn.d3_scored, updatedTurn.d4_scored,
    updatedTurn.d5_scored, updatedTurn.d6_scored,
  ]).then((results) => {
    res.sendStatus(200);
  }).catch((error) => console.log(error));
});

// saves score of players turn
router.put('/save/', rejectUnauthenticated, (req, res) => {
  const sql = `update rounds_players set has_played=$1, current_score=$2 where game_id = $3`;
  const diceValues = [
    { value: newGameData.d1_val, locked: newGameData.d1_locked },
    { value: newGameData.d2_val, locked: newGameData.d2_locked },
    { value: newGameData.d3_val, locked: newGameData.d3_locked },
    { value: newGameData.d4_val, locked: newGameData.d4_locked },
    { value: newGameData.d5_val, locked: newGameData.d5_locked },
    { value: newGameData.d6_val, locked: newGameData.d6_locked },
  ]
  newGameData.has_played = true;
  newGameData.current_score = gameData.current_score + checkMelds(diceValues)
  pool.query(sql, [newGameData.has_played, newGameData.current_score, req.params.gameId]).then(() => {
    res.sendStatus(200)
  }).catch((error) => console.log(error));
});

router.post('/lock/', rejectUnauthenticated, (req, res) => {
  // POST route code here
  // req.body NEEDS to be in this format [{values: x, locked: x, scored: x}, ...] just send all dice when you send this request
  const diceValues = req.body;

  // 0 means no scoring and anything else means your dice scored - a zero score will reflect on the clients end
  res.send({ score: checkMelds(diceValues), dice: diceValues });

});

// test data for melds
// returns 3000 as it should - const diceValues = [{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},{value: 3, locked: true},];
// returns 150 as it should - const diceValues = [{value: 1, locked: true},{value: 5, locked: true},{value: 3, locked: false},{value: 3, locked: false},{value: 3, locked: false},{value: 3, locked: false},];
// returns 1500 as it should - const diceValues = [{value: 1, locked: true},{value: 2, locked: true},{value: 3, locked: true},{value: 4, locked: true},{value: 5, locked: true},{value: 6, locked: true},];
// const diceValues = [{ value: 3, locked: true }, { value: 3, locked: true }, { value: 3, locked: true }, { value: 5, locked: true }, { value: 1, locked: true }, { value: 3, locked: false },];
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

function randomizeDice(diceValues) {
  let tempValues = diceValues
  if (!diceValues.d1_locked && !diceValues.d1_scored) {
    diceValues.d1_val = Math.floor(Math.random() * 7);
    console.log('randomized')
  }
  if (!diceValues.d2_locked && !diceValues.d1_scored) {
    diceValues.d2_val = rollDice();
  }
  if (!diceValues.d3_locked && !diceValues.d1_scored) {
    diceValues.d3_val = rollDice();
  }
  if (!diceValues.d4_locked && !diceValues.d1_scored) {
    diceValues.d4_val = rollDice();
  }
  if (!diceValues.d5_locked && !diceValues.d1_scored) {
    diceValues.d5_val = rollDice();
  }
  if (!diceValues.d6_locked && !diceValues.d1_scored) {
    diceValues.d6_val = rollDice();
  }

  tempValues = [
    { value: diceValues.d1_val, locked: diceValues.d1_locked, scored: diceValues.d1_scored, },
    { value: diceValues.d2_val, locked: diceValues.d2_locked, scored: diceValues.d2_scored, },
    { value: diceValues.d3_val, locked: diceValues.d3_locked, scored: diceValues.d3_scored, },
    { value: diceValues.d4_val, locked: diceValues.d4_locked, scored: diceValues.d4_scored, },
    { value: diceValues.d5_val, locked: diceValues.d5_locked, scored: diceValues.d5_scored, },
    { value: diceValues.d6_val, locked: diceValues.d6_locked, scored: diceValues.d6_scored, },
  ]

  return tempValues;
}

function rollDice() {
  return Math.ceil(Math.random() * 5);
}

module.exports = router;
