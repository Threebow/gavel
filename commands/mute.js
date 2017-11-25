module.exports.run = async (bot, message, args, con, cfg) => {
	if(!bot.hasPermission(message, "MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("Please provide a valid mention or ID.");

	let role = message.guild.roles.find(r => r.name === cfg.mutedRole);
	if(!role) {
		try {
			role = await message.guild.createRole({
				name: roleName,
				color: "#354856",
				permissions: []
			});
		} catch(e) {
			message.channel.send("Error: I cannot create roles.");
		}
	}

	if(target.roles.has(role.id)) return message.channel.send("This user is already muted.");

	try {
		await Promise.all(message.guild.channels.map(async c => {
			await c.overwritePermissions(role, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false
			});
		}));

		let time = parseInt(args[1]);
		if(time) {
			con.run("INSERT INTO mutes (snowflake, guild, unmutedAt) VALUES (?, ?, ?)", target.id, message.guild.id, Date.now() + time * 1000, (err) => {
				if(err) throw err;
			});
		}

		await target.addRole(role);
		return message.channel.send("User muted.");
	} catch(e) {
		message.channel.send(`Error: ${e.message}`);
	}
}

module.exports.help = {
	name: "mute"
}