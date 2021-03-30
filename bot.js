const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: 'localhost',             // minecraft server ip
  username: 'FaytheBot', // minecraft username
  // password: '',          // minecraft password, comment out if you want to log into online-mode=false servers
  port: 52816,                // only set if you need a port that isn't 25565
  // version: false,             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // auth: 'mojang'              // only set if you need microsoft auth, then set this to 'microsoft'
})

const TRADER_USERNAME = "notLAn"

function isTrader(username) {
  if (username == TRADER_USERNAME) {
    bot.chat("TRADE EXECUTED.")
  }
}

bot.on("chat", (username, message) => {
  if (message.includes("is trying to trade with you.")) {
    isTrader(username)
  }
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)