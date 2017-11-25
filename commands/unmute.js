module.exports.run = async (bot, message, args, con, cfg) => {
	if(!bot.hasPermission(message, "MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("Please provide a valid mention or ID.");

	let role = message.guild.roles.find(r => r.name === cfg.mutedRole);
	if(!role || !target.roles.has(role.id)) return message.channel.send("This user is not muted.");

	try {
		await target.removeRole(role);
		message.channel.send("User unmuted.");
	} catch(e) {
		message.channel.send(`Error: ${e.message}`);
	}
}

module.exports.help = {
	name: "unmute"
}