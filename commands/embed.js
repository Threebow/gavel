const { RichEmbed } = require("discord.js");

module.exports.run = (bot, message, args, con) => {
	let str = args.join(" ");
	if(!str) return message.channel.send("Please supply some content.");

	message.channel.send(new RichEmbed().setDescription(str).setColor("#daa520"));
}

module.exports.help = {
	name: "e"
}