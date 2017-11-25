module.exports.run = (bot, message, args, con) => {
	if(!bot.hasPermission(message, "ADMINISTRATOR")) return message.channel.send("You do not have permission to do this.");

	let key = args[0];
	let val = args.slice(1).join(" ");

	if(!key) {
		con.all("SELECT * FROM config WHERE guild = ?", message.guild.id, (err, rows) => {
			if(err) throw err;

			if(rows.length < 1) return message.channel.send("This server has no config options set.");
			message.channel.send(`__Config Options:__\n\n${rows.map(r => `\`${r.option}\`: ${r.value}`).join("\n")}`);
		});

		return;
	}

	if(!val) {
		con.get("SELECT * FROM config WHERE guild = ? AND option = ?", message.guild.id, key, (err, r) => {
			if(err) throw err;
			if(r) return message.channel.send(`\`${r.option}\`: ${r.value}`);
			message.channel.send(`Option \`${r.option}\` has no value.`);
		});

		return;
	}

	bot.getConfigOption(message.guild, "abc").then(v => console.log(v));

	con.get("SELECT * FROM config WHERE option = ? AND guild = ?", key.toLowerCase(), message.guild.id, (err, r) => {
		if(r) {
			con.run("UPDATE config SET value = ? WHERE id = ?", val, r.id, (err) => {
				message.channel.send("Config option updated.");
			});
		} else {
			con.run("INSERT INTO config (option, value, guild) VALUES (?, ?, ?)", key, val, message.guild.id, (err) => {
				message.channel.send("Config option set.");
			});
		}
	});
}

module.exports.help = {
	name: "config"
}