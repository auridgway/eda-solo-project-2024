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
router.post('/', rejectUnauthenticated, (req, res) => {
    // POST route code here
    const sql = `insert into players (user_id, game_id)
    values ($1, $2)`;
    const joinData = req.body;
    pool.query(sql, [req.user.id, joinData.game_id]).then((results) => {
        res.sendStatus(200);
    }).catch((error) => console.log(error));

});

module.exports = router;
