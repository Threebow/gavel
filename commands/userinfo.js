const { RichEmbed } = require("discord.js");
const moment = require("moment");

module.exports.run = (bot, message, args, con) => {
	let target = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;

	let createdAt = moment(target.user.createdAt).format("D MMM YYYY, h:mm a");
	let joinedAt = moment(target.joinedAt).format("D MMM YYYY, h:mm a");

	let embed = new RichEmbed()
		.setColor(target.displayColor)
		.setThumbnail(target.user.displayAvatarURL)
		.addField("Username", target.user.tag, true)
		.addField("Nickname", target.nickname || "None", true)
		.addField("ID", target.id, true)
		.addField("Account Created", createdAt, true)
		.addField("Joined Server", joinedAt, true)
		.setTimestamp();

	message.channel.send(embed);
}

module.exports.help = {
	name: "userinfo"
}