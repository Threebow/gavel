module.exports.run = async (bot, message, args, con) => {
	if(!bot.hasPermission(message, "MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let mention = message.mentions.users.first();

	let amount;
	if(mention) {
		amount = 100
	} else {
		amount = parseInt(args[0]);
		if(!amount || amount < 1 && amount < 100) return message.channel.send("Please enter a number between 1 and 100.");
		amount = Math.min(amount + 1, 100);
	}

	try {
		let messages = await message.channel.fetchMessages({limit: amount});
		messages = messages.filter(m => m.createdTimestamp >= Date.now() - 1179360000);
		
		let mention = message.mentions.users.first();
		if(mention) messages = messages.filter(m => m.author.id === mention.id || m.content === message.content);

		let pruned = messages.size;
		if(pruned < 1) return message.channel.send("No prune-able messages were found.");
		await message.channel.bulkDelete(messages);
		
		message.channel.send(`Prune successful. Deleted ${pruned === amount ? pruned - 1 : pruned} messages.`).then(m => m.delete(1000));
	} catch(e) {
		message.channel.send(`Prune failed: ${e.message}`);
	}
}

module.exports.help = {
	name: "prune"
}