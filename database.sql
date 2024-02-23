-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE rounds (
    id SERIAL PRIMARY KEY,
    round_number integer NOT NULL DEFAULT 0,
    game_id integer NOT NULL REFERENCES games(id)
);

CREATE TABLE rounds_players (
    id SERIAL PRIMARY KEY,
    round_id integer NOT NULL REFERENCES rounds(id),
    player_id integer NOT NULL REFERENCES players(id),
    d1_val integer NOT NULL DEFAULT 1,
    d1_locked boolean NOT NULL DEFAULT false,
    d2_val integer NOT NULL DEFAULT 2,
    d2_locked boolean NOT NULL DEFAULT false,
    d3_val integer NOT NULL DEFAULT 3,
    d3_locked boolean NOT NULL DEFAULT false,
    d4_val integer NOT NULL DEFAULT 4,
    d4_locked boolean NOT NULL DEFAULT false,
    d5_val integer NOT NULL DEFAULT 5,
    d5_locked boolean NOT NULL DEFAULT false,
    d6_val integer NOT NULL DEFAULT 6,
    d6_locked boolean NOT NULL DEFAULT false,
    current_score integer NOT NULL DEFAULT 0,
    rolls integer NOT NULL DEFAULT 0,
    farkle boolean NOT NULL DEFAULT false,
    has_played boolean NOT NULL DEFAULT false,
    d1_scored boolean DEFAULT false,
    d2_scored boolean DEFAULT false,
    d3_scored boolean DEFAULT false,
    d4_scored boolean DEFAULT false,
    d5_scored boolean DEFAULT false,
    d6_scored boolean DEFAULT false
);
	
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username character varying(80) NOT NULL UNIQUE,
    password character varying(1000) NOT NULL
);
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    time date NOT NULL DEFAULT CURRENT_DATE,
    winner_id integer,
    status character varying(20) NOT NULL DEFAULT 'created'::character varying,
    owner_id integer NOT NULL,
    lobby_name character varying(25) NOT NULL,
    passphrase character varying(25),
    current_turn integer REFERENCES players(id)
);
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES "user"(id),
    game_id SERIAL REFERENCES games(id),
    user_resigned boolean NOT NULL DEFAULT false,
    joined_at timestamp without time zone DEFAULT CURRENT_DATE
);