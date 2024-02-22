const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', rejectUnauthenticated, (req, res) => {
    // GET route code here

});

/**
 * POST route template
 */
router.post('/join', rejectUnauthenticated, (req, res) => {
    // POST route code here
    const sql = `insert into players (user_id, game_id)
    values ($1, $2)`;
    const joinData = req.body;
    pool.query(sql, [req.user.id, joinData.game_id]).then((results) => {
        res.sendStatus(200);
    }).catch((error) => console.log(error));
});

router.post('/create', rejectUnauthenticated, async (req, res) => {
    // POST route code here
    const createGame = `insert into games (owner_id, lobby_name)
    values ($1, $2)`;
    const createRounds =`insert into rounds (round_number, game_id)
    values (0, (select game_id from games where owner_id=$1))`;
    try {
        // make the game table
        await pool.query(createGame, [req.user.id, req.body.lobby_name]);
        // make a round for the game in the rounds table
        await pool.query(createGame, [req.user.id]);
        // make a player in the players table

        // give the player an opening turn in the rounds_players table



        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
