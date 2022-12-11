const ora = require('ora')
const fs = require('fs')
const { Client, Collection } = require('discord.js')
const slash = require('./src/util/slash')
const intentsLoader = ora('Registering Intents').start()
const client = new Client({
    intents: ["GUILDS", "GUILDS","GUILD_MEMBERS","GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"]
});
const config = require('./config.json')
const { io } = require("socket.io-client");
var socket = io.connect('http://80.91.223.225:7777');

client.commands = new Collection()

const events = fs
  .readdirSync('./src/events')
  .filter(file => file.endsWith('.js'))

events.forEach(event => {
  const eventFile = require(`./src/events/${event}`)
  if (eventFile.oneTime) {
    client.once(eventFile.event, (...args) => eventFile.run(...args))
  } else {
    client.on(eventFile.event, (...args) => eventFile.run(...args))
  }
})

socket.on('message', function (data) {
  if(data) {
    console.log('\n\n'+data.info+'\n');
  } else {
    console.log('\n\nSERVERS OFFLINE\n')
  }
});

process.on('exit', () => {
  console.log('closing resources!')
  browserlessFactory.close()
})

client.login(config.token)
