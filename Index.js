const { Client, GatewayIntentBits } = require('discord.js');
const AgarioClient = require('./lib/agario-client'); // Asegúrate de tener el cliente en ./lib
require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OWNER_NICKNAME = 'Bσм.ioz#Live1k🔴';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!bots')) return;

  const args = message.content.split(' ');
  if (args.length < 4) {
    return message.channel.send('Uso correcto: `!bots <código_party> <región> <modo>`');
  }

  const [_, partyCode, region, mode] = args;

  if (mode !== 'seguir') {
    return message.channel.send('Modo inválido. Usa: `seguir`');
  }

  for (let i = 0; i < 28; i++) {
    conectarBot(partyCode, region);
  }

  message.channel.send(`🚀 Enviando 28 bots al party \`${partyCode}\` en región \`${region}\` en modo **seguir** a ${OWNER_NICKNAME}`);
});

function conectarBot(partyCode, region) {
  const bot = new AgarioClient();
  bot.debug = 0;
  bot.nickname = '🔴';
  bot.connect(`ws://${region}.agar.io:443`, partyCode);

  bot.on('connected', () => {
    console.log('✅ Bot conectado a la party');
  });

  bot.on('players', (players) => {
    const owner = players.find(p => p.name === OWNER_NICKNAME && p.id !== bot.id);
    if (owner) {
      bot.setTarget(owner.x, owner.y);
    }
  });

  bot.on('disconnect', () => {
    console.log('❌ Bot desconectado, reintentando...');
    setTimeout(() => conectarBot(partyCode, region), 2000);
  });
}

client.login(DISCORD_TOKEN);
