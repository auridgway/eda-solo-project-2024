-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "rounds" (
	"id" serial NOT NULL,
	"round_number" integer NOT NULL DEFAULT '0',
	"game_id" integer NOT NULL REFERENCES "games"("id"),
);

CREATE TABLE "rounds_players" (
	"id" serial NOT NULL,
	"round_id" integer NOT NULL REFERENCES "rounds"("id"),
	"player_id" integer NOT NULL REFERENCES "users"("id"),
	"d1_val" integer NOT NULL DEFAULT '1',
	"d1_locked" BOOLEAN NOT NULL DEFAULT 'false',
	"d2_val" integer NOT NULL DEFAULT '2',
	"d2_locked" BOOLEAN NOT NULL DEFAULT 'false',
	"d3_val" integer NOT NULL DEFAULT '3',
	"d3_locked" BOOLEAN NOT NULL DEFAULT 'false',
	"d4_val" integer NOT NULL DEFAULT '4',
	"d4_locked" BOOLEAN NOT NULL DEFAULT 'false',
	"d5_val" integer NOT NULL DEFAULT '5',
	"d5_locked" BOOLEAN NOT NULL DEFAULT 'false',
	"d6_val" integer NOT NULL DEFAULT '6',
	"d6_locked" BOOLEAN NOT NULL DEFAULT 'false',
	"current_score" integer NOT NULL DEFAULT '0',
	"rolls" integer NOT NULL DEFAULT '0',
);

CREATE TABLE "players" (
	"id" serial NOT NULL,
	"user_id" serial NOT NULL REFERENCES "users"("id"),
	"game_id" serial NOT NULL REFERENCES "games"("id"),
	"user_resigned" BOOLEAN NOT NULL DEFAULT 'false',
);

CREATE TABLE "games" (
	"id" serial NOT NULL,
	"time" DATE NOT NULL DEFAULT CURRENT_DATE,
	"numplayers" integer DEFAULT '1',
	"winner_id" integer,
	"status" varchar(20) NOT NULL DEFAULT 'created',
	"owner_id" integer NOT NULL,
	"lobby_name" integer(25) NOT NULL,
	"passphrase" varchar(25),
);
