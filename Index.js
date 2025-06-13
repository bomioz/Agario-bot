const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const TOKEN = process.env.DISCORD_TOKEN;

client.on('ready', () => {
  console.log(`Bot listo: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('pong!');
  }

  if (command === 'bots') {
    if (args.length !== 3) {
      return message.channel.send('Uso correcto: `!bots <código_party> <región> <modo>`');
    }
    const [partyCode, region, mode] = args;

    // Valida modo (solo 'seguir' y 'burst' en este ejemplo)
    if (!['seguir', 'burst'].includes(mode.toLowerCase())) {
      return message.channel.send('Modo inválido. Usa: `seguir` o `burst`');
    }

    // Aquí debes poner la lógica para iniciar los bots con esos parámetros
    // Por ahora solo responderemos que recibió bien el comando
    return message.channel.send(`Iniciando bots en party ${partyCode}, región ${region}, modo ${mode}`);
  }
});

client.login(TOKEN);
