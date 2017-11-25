module.exports.run = async (bot, message, args, con) => {
	if(!bot.hasPermission(message, "KICK_MEMBERS")) return message.channel.send("You do not have permission to do this.");
	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("Please provide a valid mention or ID.");

	if(!target.kickable) return message.channel.send("I cannot kick this user.");

	let reason = args.slice(1).join(" ");

	try {
		await target.send(`You have been kicked from \`${message.guild.name}\`.\n**Reason:** ${reason || "No reason provided."}`);
	} catch(e) {
		message.channel.send("Warning: Could not send this user a DM informing them of their kick. They likely have messages turned off.");
	}

	try {
		await target.kick(reason);
		message.channel.send("User kicked.");
	} catch(e) {
		message.channel.send(`Kick failed: ${e.message}`)
	}
}

module.exports.help = {
	name: "kick"
}