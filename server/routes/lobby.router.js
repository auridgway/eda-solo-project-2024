const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET route template
 */
router.get('/', (req, res) => {
    // GET route code here
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
    // POST route code here
    const sql = `insert into players (user_id, game_id)
  values ($1, $2)`;
    const joinData = req.body;
    pool.query(sql, [])

});

module.exports = router;
