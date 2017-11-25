//NPM Modules
const Discord = require("discord.js"),
	  fs = require("fs");

//Our Modules
const con = require("./sql.js");

//Config
const cfg = require("./config.json");

//Instantiation
const bot = new Discord.Client({disableEveryone: true, fetchAllMembers: true});
bot.commands = new Discord.Collection()

//Helper functions, use this for role based perms or whatever
bot.hasPermission = (message, perm) => {
	return message.member.hasPermission(perm);
}

bot.getConfigOption = (guild, opt) => {
	return new Promise((resolve, reject) => {
		con.get("SELECT * FROM config WHERE option = ? AND guild = ?", opt, guild.id, (err, r) => {
			if(err) reject(err);
			resolve(r.value);
		});
	});
}

//Command loader
let cmds = fs.readdirSync("./commands/");
cmds = cmds.filter(cmd=>cmd.split(".").pop() === "js");

cmds.forEach(cmd => {
	let props = require(`./commands/${cmd}`);
	bot.commands.set(props.help.name, props)
});

//Mutes, bans
bot.on("ready", () => {
	console.log("Bot logged in.");
	bot.setInterval(() => {
		con.all("SELECT * FROM mutes", (err, rows) => {
			if(err) throw err;

			rows.forEach(r => {
				let guild = bot.guilds.get(r.guild);
				if(!guild) return;
				let member = guild.members.get(r.snowflake);
				if(!member) return;

				if(Date.now() > r.unmutedAt) {
					let role = member.roles.find(r => r.name === cfg.mutedRole);
					if(role) member.removeRole(role.id).catch(()=>{});
					
					con.run("DELETE FROM mutes WHERE id = ?", r.id, (err) => {
						if(err) throw err;
						console.log(`Unmuted ${member.id} (${r.id}).`);
					});
				}
			});
		});

		con.all("SELECT * FROM bans", (err, rows) => {
			if(err) throw err;

			rows.forEach(r => {
				let guild = bot.guilds.get(r.guild);
				if(!guild) return;
				let member = guild.members.get(r.snowflake);
				if(!member) return;

				if(Date.now() > r.unbannedAt) {
					guild.unban(r.snowflake).catch(()=>{});
					con.run("DELETE FROM bans WHERE id = ?", r.id, (err) => {
						if(err) throw err;
						console.log(`Unbanned ${member.id} (${r.id}).`);
					});
				}
			});
		});
	}, 5000);
});

//Message handler
bot.on("message", async (message) => {
	if(!message.content.startsWith(cfg.prefix)) return;
	
	if(message.system) return;
	if(message.channel.type.toLowerCase() === "dm") return;
	if(message.author.bot) return;

	if(!message.guild.me.permissionsIn(message.channel).has(["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"])) return;

	let split = message.content.split(/ +/g);
	let name = split[0].slice(cfg.prefix.length).toLowerCase();
	let args = split.slice(1);

	con.get(`SELECT * FROM blacklist WHERE snowflake = ? AND guild = ?`, message.author.id, message.guild.id, (err, r) => {
		if(err) throw err;
		if(r) return message.channel.send("You are blacklisted.");

		let command = bot.commands.get(name);
		if(command) command.run(bot, message, args, con, cfg);
	});

});

//Login
bot.login(cfg.token)

//Unhandled Rejections
process.on("unhandledRejection", console.error);