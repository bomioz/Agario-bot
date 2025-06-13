require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { startBots } = require('./connect');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log('Bot listo!');
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!bots') || message.author.bot) return;

  const args = message.content.split(' ').slice(1);
  if (args.length !== 3) {
    return message.channel.send('Uso correcto: `!bots <código_party> <región> <modo>`');
  }

  const [partyCode, region, mode] = args;
  startBots(partyCode, region, mode, message);
});

client.login(process.env.DISCORD_TOKEN);
