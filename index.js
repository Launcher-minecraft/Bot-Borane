const { Client, Intents} = require('discord.js');
const { token/*, db*/ } = require('./config.json');
const fs = require('node:fs');
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS
]});


/*
var mysql = require('mysql');
var mysqlConn = mysql.createConnection({
	host     : db.host,
	user     : db.user,
	password : db.pass,
	database : db.database
});
mysqlConn.connect();
*/


var commands = new Map;
client.on('ready', async () => {
	const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.set(command.data.name, command);


		client.application.commands.create(command.data);
		//client.guilds.cache.get("YOURSERVERID").commands.create(command.data);
	}

	const eventsFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
	for (const file of eventsFiles) {
		const command = require(`./events/${file}`);

		try{
			command(client/*, mysqlConn*/);
		} catch (error) {
			console.log(error);
		}
		
	}

	client.user.setPresence({ activities: [{ name: client.guilds.cache.size+" servers", type: "WATCHING" }] });

	console.log(client.user.tag + " Ready !");
});


client.on("interactionCreate", async interaction => {

	if(interaction.isCommand()){
		try {
			await commands.get(interaction.commandName).execute(interaction/*, mysqlConn*/);
		} catch (error) {
			console.log(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});



client.login(token);