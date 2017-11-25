module.exports.run = async (bot, message, args, con) => {
	if(!bot.hasPermission(message, "BAN_MEMBERS")) return message.channel.send("You do not have permission to do this.");
	
	let search = args.join(" ");
	if(!search) return message.channel.send("Please provide a valid ID or name.");

	try {
		let bans = await message.guild.fetchBans();
		let banned = bans.get(search) || bans.find(u => u.tag.toLowerCase().includes(search.toLowerCase()));
		
		if(!banned) return message.channel.send("I could not find a banned user by this ID or name.");

		await message.guild.unban(banned);

		message.channel.send(`${banned.tag} has been unbanned.`);
	} catch(e) {
		message.channel.send(`Unban failed: ${reason}`)
	}
}

module.exports.help = {
	name: "unban"
}