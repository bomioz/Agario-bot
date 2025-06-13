function startBots(partyCode, region, mode, message) {
  // Aquí se simula la conexión. Más adelante conectarás los bots reales.
  message.channel.send(`Conectando 28 bots a la party **${partyCode}** en **${region}** en modo **${mode}**...`);
}

module.exports = { startBots };
