module.exports.run = async (bot, message, args, con) => {
	if(!bot.hasPermission(message, "MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("Please provide a valid mention or ID.");

	let reason = args.slice(1).join(" ");
	if(!reason) return message.channel.send("Please provide a valid reason.")

	con.run(`INSERT INTO warnings (snowflake, reason, warner, guild, time) VALUES (?, ?, ?, ?, ?)`, target.id, reason, message.author.id, message.guild.id, Date.now(), (err) => {
		if(err) throw err;
		message.channel.send("User warned.");
	})
}

module.exports.help = {
	name: "warn"
}