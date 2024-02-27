const express = require('express');
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const router = express.Router();
const { getGameById } = require('../modules/queries');


/*
    GET a single game info (mostly for testing)
*/
router.get('/info/:gameId', rejectUnauthenticated, async (req, res) => {
    try {
        const thisGame = await getGameById(req.params.gameId);
        res.send(thisGame);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/join', rejectUnauthenticated, async (req, res) => {
    // POST route code here
    const addPlayerToGame = `insert into players (user_id, game_id) values ($1, $2)`;
    try {
        await pool.query(addPlayerToGame, [req.user.id, req.body.game_id])
        res.sendStatus(200);
    } catch (error) {
        // TODO: Do we care about telling the frontend that there is a specific 
        // error when the user joins a game they're already in? Maybe not
        console.log(error)
        res.sendStatus(400);
    }

});

router.delete('/leave', rejectUnauthenticated, async (req, res) => {
    const leaveGame = `delete from players where user_id = $1`;
    try {
        pool.query(leaveGame, [req.user.id])
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
    }

});

// create a new game, if ?testGame=true, dice will not be randomized
router.post('/create/', rejectUnauthenticated, async (req, res) => {
    // testGame=true
    const testGame = req.query.testGame || false;

    // POST route code here
    const createGame = `insert into games (owner_id, lobby_name) values ($1, $2) RETURNING *`;
    const createPlayers = `insert into players (user_id, game_id) values ($1, $2)`;

    // create data needs to have just the lobby name in it as well as a logged in user in order to create the game
    const lobbyName = req.body.lobby_name || `New Game ${Math.round(Math.random() * 10000)}`

    try {
        // make the game table
        const result1 = await pool.query(createGame, [req.user.id, lobbyName]);
        const gameId = result1.rows[0].id;

        // make a player in the players table
        await pool.query(createPlayers, [req.user.id, gameId]);

        res.send(result1.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
