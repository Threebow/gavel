const roleName = require("./../config.json").mutedRole;
const { RichEmbed } = require("discord.js");
const moment = require("moment");

module.exports.run = (bot, message, args, con) => {
	if(!bot.hasPermission(message, "MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("Please provide a valid mention or ID.");

	con.all(`SELECT * FROM warnings WHERE snowflake = ? AND guild = ?`, target.id, message.guild.id, async (err, r) => {
		if(err) throw err;

		const embed = new RichEmbed()
			.setAuthor(`${target.user.tag}'s Warnings`, target.user.displayAvatarURL)
			.setDescription("These are all of the warnings which have been issued to this user.")
			.setColor("#9500d6");

		for (var i = 0; i < r.length; i++) {
			let w = r[i];

			embed.addField(moment(w.time).format("D MMM YYYY, h:mm a"), `**Reason:** ${w.reason}\n**Warner:** ${(bot.users.get(w.warner) || await bot.fetchUser(w.warner)).tag}`, true)
		}

		message.channel.send(embed);
	})
}

module.exports.help = {
	name: "warnings"
}