const sql = require("sqlite3");
const db = new sql.Database("bot.sqlite");
console.log("Initialized database connection.")

const tables = {
	blacklist: [
		"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
		"snowflake TEXT NOT NULL",
		"guild TEXT NOT NULL"
	],
	warnings: [
		"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
		"snowflake TEXT NOT NULL",
		"reason TEXT NOT NULL",
		"warner TEXT NOT NULL",
		"guild TEXT NOT NULL",
		"time INTEGER NOT NULL"
	],
	bans: [
		"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
		"snowflake TEXT NOT NULL",
		"guild TEXT NOT NULL",
		"unbannedAt INTEGER NOT NULL"
	],
	mutes: [
		"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
		"snowflake TEXT NOT NULL",
		"guild TEXT NOT NULL",
		"unmutedAt INTEGER NOT NULL"
	],
	config: [
		"id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
		"option TEXT NOT NULL",
		"value TEXT NOT NULL",
		"guild TEXT NOT NULL"
	]
}

for(let table in tables) {
	db.run(`CREATE TABLE ${table} (${tables[table].join(", ")})`, () => {
		console.log(`Initialized table "${table}".`);
	});
}

module.exports = db