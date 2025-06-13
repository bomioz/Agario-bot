// Cliente de ejemplo personalizado de Agar.io
const WebSocket = require('ws');

class AgarioClient {
  constructor(nickname = 'Bot') {
    this.nickname = nickname;
    this.ws = null;
  }

  connect(region, party) {
    const url = `wss://${region}.agar.io:443/`;
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log(`[${this.nickname}] Conectado a ${region} (${party})`);
      this.sendInit(party);
    });

    this.ws.on('message', (data) => {
      // Aquí iría la lógica para procesar los mensajes del servidor
    });

    this.ws.on('close', () => {
      console.log(`[${this.nickname}] Desconectado.`);
    });

    this.ws.on('error', (err) => {
      console.error(`[${this.nickname}] Error:`, err.message);
    });
  }

  sendInit(party) {
    const buf = Buffer.alloc(5 + party.length);
    buf.writeUInt8(254, 0);
    buf.writeUInt32LE(5, 1);
    this.ws.send(buf);

    const buf2 = Buffer.from([255, 1, 0, 0, 0]);
    this.ws.send(buf2);

    const partyBuf = Buffer.alloc(1 + party.length);
    partyBuf.writeUInt8(80, 0);
    for (let i = 0; i < party.length; i++) {
      partyBuf.writeUInt8(party.charCodeAt(i), 1 + i);
    }
    this.ws.send(partyBuf);

    setTimeout(() => {
      this.spawn();
    }, 1000);
  }

  spawn() {
    const nickBuf = Buffer.alloc(1 + this.nickname.length * 2);
    nickBuf.writeUInt8(0, 0);
    for (let i = 0; i < this.nickname.length; i++) {
      nickBuf.writeUInt16LE(this.nickname.charCodeAt(i), 1 + i * 2);
    }
    this.ws.send(nickBuf);
    console.log(`[${this.nickname}] Spawn enviado`);
  }

  split() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(Buffer.from([17]));
    }
  }

  eject() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(Buffer.from([21]));
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = AgarioClient;
