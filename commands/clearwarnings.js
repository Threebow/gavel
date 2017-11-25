const roleName = "Muted"
const moment = require("moment");

module.exports.run = (bot, message, args, con) => {
	if(!bot.hasPermission(message, "MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("Please provide a valid mention or ID.");

	con.run("DELETE FROM warnings WHERE snowflake = ? AND guild = ?", target.id, message.guild.id, (err) => {
		if(err) throw err;
		message.channel.send(`I have cleared ${target.user.tag}'s warnings.`);
	});
}

module.exports.help = {
	name: "clearwarnings"
}