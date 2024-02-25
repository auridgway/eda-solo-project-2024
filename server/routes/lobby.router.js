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
router.post('/join', rejectUnauthenticated, async (req, res) => {
    // POST route code here
    const addPlayerToGame = `insert into players (user_id, game_id)
    values ($1, $2)`;
    const addPlayerRounds = `insert into rounds_players ("round_id","player_id")
    values ($1,$2)`;
    // join data needs to have the game_id and the round_id upon pressing the join button
    const joinData = req.body;

    try {
        pool.query(addPlayerToGame, [req.user.id, joinData.game_id])
        pool.query(addPlayerRounds, [joinData.round_id, req.user.id])
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
    }
});

router.post('/create', rejectUnauthenticated, async (req, res) => {
    // POST route code here
    const createGame = `insert into games (owner_id, lobby_name)
    values ($1, $2)`;
    const createRounds = `insert into rounds (round_number, game_id)
    values (0, (select id from games where owner_id=$1 order by id desc limit 1));`;
    const createPlayers = `insert into players (user_id, game_id)
    values ($1, (select id from games where owner_id=$1 order by id desc limit 1))`;
    const createTurn = `insert into rounds_players ("round_id","player_id")
    values ((select id from rounds where game_id=(select id from games where owner_id=$1 order by id desc limit 1) order by id desc limit 1) , 1)`;
        // create data needs to have just the lobby name in it as well as a logged in user in order to create the game
    const createData = req.body

    try {
        // make the game table
        await pool.query(createGame, [req.user.id, createData.lobby_name]);
        // make a round for the game in the rounds table
        await pool.query(createRounds, [req.user.id]);
        // make a player in the players table
        await pool.query(createPlayers, [req.user.id]);
        // give the player an opening turn in the rounds_players table
        await pool.query(createTurn, [req.user.id]);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
