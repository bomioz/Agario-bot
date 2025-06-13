require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const AgarioClient = require('./lib/agario-client'); // tu cliente personalizado

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = '!';
const BOT_NAME = 'Bσм.ioz#Live1k🔴'; // El nombre que quieres para los bots

client.once('ready', () => {
  console.log('Bot listo!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong!');
  } 
  else if (command === 'bots') {
    if (args.length < 3) {
      return message.channel.send('Uso correcto: `!bots <código_party> <región> <modo>`');
    }

    const partyCode = args[0];
    const region = args[1];
    const mode = args[2].toLowerCase();

    const validModes = ['seguir', 'alimentar', 'dividir', 'burst'];

    if (!validModes.includes(mode)) {
      return message.channel.send('Modo inválido. Usa: `seguir`, `alimentar`, `dividir` o `burst`');
    }

    message.channel.send(`Enviando bots en party ${partyCode} región ${region} modo ${mode}...`);

    for (let i = 0; i < 28; i++) {
      const bot = new AgarioClient({
        partyCode,
        region,
        nick: BOT_NAME,
      });

      bot.connect();

      bot.on('connected', () => {
        if (mode === 'seguir' || mode === 'burst') {
          bot.followPlayer(message.author.username);
        }
        if (mode === 'alimentar' || mode === 'burst') {
          bot.startFeeding();
        }
        if (mode === 'dividir' || mode === 'burst') {
          bot.startSplitting();
        }
      });

      bot.on('disconnected', () => {
        console.log(`Bot ${i} desconectado.`);
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
