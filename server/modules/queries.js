const pool = require('./pool');

async function getGameById(gameId) {
   try {
      const queryText = `
     SELECT *,
     (SELECT coalesce(jsonb_agg(item), '[]'::jsonb) FROM (
       SELECT *, 
         (SELECT coalesce(jsonb_agg(item2), '[]'::jsonb) FROM (
           SELECT * FROM "rounds_players" WHERE "rounds_players"."round_id"="rounds"."id"
         ) item2) as "rounds_players"
         FROM "rounds" WHERE "rounds"."game_id"="games"."id" ORDER BY "rounds"."round_number" DESC)
     item) as "rounds",
 (SELECT coalesce(jsonb_agg(item), '[]'::jsonb) FROM (
     SELECT "players".*, "user"."username" FROM "players" 
       JOIN "user" ON "user"."id" = "players"."user_id" WHERE "players"."game_id"="games"."id") item) as "players"
   from "games" WHERE id=$1;
   `
      const result = await pool.query(queryText, [gameId]);
      return result.rows[0];
   } catch (err) {
      console.error(`Error GETTING game by id`, err);
      return null;
   }
}

async function getAllGames() {
   try {
      const queryText = `
     SELECT *,
     (SELECT coalesce(jsonb_agg(item), '[]'::jsonb) FROM (
       SELECT *, 
         (SELECT coalesce(jsonb_agg(item2), '[]'::jsonb) FROM (
           SELECT * FROM "rounds_players" WHERE "rounds_players"."round_id"="rounds"."id"
         ) item2) as "rounds_players"
         FROM "rounds" WHERE "rounds"."game_id"="games"."id" ORDER BY "rounds"."round_number" DESC)
     item) as "rounds",
 (SELECT coalesce(jsonb_agg(item), '[]'::jsonb) FROM (
     SELECT "players".*, "user"."username" FROM "players" 
       JOIN "user" ON "user"."id" = "players"."user_id" WHERE "players"."game_id"="games"."id") item) as "players"
   from "games";
   `
      const result = await pool.query(queryText);
      return result.rows[0];
   } catch (err) {
      console.error(`Error GETTING game`, err);
      return null;
   }
}

async function createNewTurnByGameId(gameId, testGame = false) {
   /*
      This sets the game to 'inprogress', sets the current turn to
      the game owner, and inserts a new round + rolls dice

      This is safe to call for any new turn because 'inprogress' is
      the default state for a game in progress, and the game owner
      will always be the first player in a new round.
   */
   const sql = `
   update "games" set "status" = 'inprogress', "current_turn" = "owner_id" 
   WHERE id = $1 RETURNING *;`;

   // const gameId = req.body[0].id;
   try {
      const result = await pool.query(sql, [gameId]);

      // For each player, roll their initial roll
      // make a round for the game in the rounds table
      const createRounds = `insert into rounds (round_number, game_id) values (1, $1) RETURNING *;`;
      const result2 = await pool.query(createRounds, [gameId]);
      const roundId = result2.rows[0].id;

      const result3 = `SELECT * FROM "players" WHERE "game_id"=$1`;
      const playersResult = await pool.query(result3, [gameId]);

      for (const player of playersResult.rows) {
         // give the player an opening turn in the rounds_players table
         const dice_values = [1, 5, 3, 6, 4, 6];
         if (!testGame) {
            dice_values.length = 0;
            for (let i = 0; i < 6; i++) {
               // sets dice to 1-6 for a test game, or randomizes 1-6
               dice_values.push(Math.ceil(Math.random() * 6))
            }
         }
         const createTurn = `
    insert into rounds_players 
    ("rolls","round_id","player_id","d1_val","d2_val","d3_val","d4_val","d5_val","d6_val") 
    values ($1, $2, $3, $4, $5, $6, $7, $8)`;
         await pool.query(createTurn, [1, roundId, player.user_id, ...dice_values]);

         // Send back the current game but in a nice pretty format
         const finalResult = await getGameById(gameId);
         return finalResult;
      }
   } catch (err) {
      console.error('ERROR making new round', err);
      throw err;
   }
}

module.exports = {
   getGameById,
   getAllGames,
   createNewTurnByGameId
}