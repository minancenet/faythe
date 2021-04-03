const mineflayer = require("mineflayer")
const pathfinder = require("mineflayer-pathfinder").pathfinder
const Movements = require("mineflayer-pathfinder").Movements
const { GoalNear } = require("mineflayer-pathfinder").goals
const Vec3 = require("vec3").Vec3;

const bot = mineflayer.createBot({
  host: "192.168.1.178",
  username: "FaytheBot",
  // password: "",
  port: 52826,
  // version: false,
  // auth: "mojang"
})

bot.loadPlugin(pathfinder)

// Input that would be received from the web server
const TRADER_USERNAME = "_L4N"
const LOCATION = 0

function isTrader(username) {
  if (username == TRADER_USERNAME) {
    bot.chat("TRADE EXECUTED.")

    return true
  } else {
    return false
  }
}

function goHome() {
  const mcData = require("minecraft-data")(bot.version)
  const defaultMove = new Movements(bot, mcData)

  // First execute /warp home
  const targets = bot.findBlocks({
    point: bot.entity.position,
    matching: 152,
    maxDistance: 128,
    count: 2
  })
  if (!targets) { return }

  const block0 = bot.blockAt(targets[0])
  const block1 = bot.blockAt(targets[1])

  bot.pathfinder.setMovements(defaultMove)
  bot.pathfinder.setGoal(new GoalNear(block1.position.x, block1.position.y+1, block1.position.z, 0))  
}

function getSigns() {
  return bot.findBlocks({
    point: bot.entity.position,
    matching: 68,
    maxDistance: 128,
    count: 256
  })
}

function storeItems() {
  const mcData = require("minecraft-data")(bot.version)
  const defaultMove = new Movements(bot, mcData)

  // Find all signs and check if each inventory item is in any of the signs
  const signs = getSigns()
  for (var i = 0; i < signs.length; i++) {
    for (var j = 0; j < bot.inventory.slots.length; j++) {
      if (bot.inventory.slots[j]) {
        if (bot.blockAt(signs[i]).signText.includes(bot.inventory.slots[j].displayName)) {
          // If there is already a sign with an item that is in Faythe's inventory
          bot.pathfinder.setMovements(defaultMove)
          bot.pathfinder.setGoal(new GoalNear(bot.blockAt(signs[i]).position.x, bot.entity.position.y, bot.entity.position.z, 0))

          const chestPos = new Vec3(bot.blockAt(signs[i]).position.x, bot.blockAt(signs[i]).position.y, bot.blockAt(signs[i]).position.z+1)
          const item = bot.inventory.slots[j]
          bot.openBlock(bot.blockAt(chestPos)).then(function(chest) {
            chest.deposit(item.type, null, item.count).then(function(item) {
              bot.closeWindow(chest)
            })
          })
        }
      }
    }
  }
}

bot.once("spawn", () => {
  const mcData = require("minecraft-data")(bot.version)
  const defaultMove = new Movements(bot, mcData)

  bot.on("chat", function(username, message) {
    if (username === bot.username) return

    const target = bot.players[username] ? bot.players[username].entity : null
    if (message === 'come') {
      if (!target) {
        bot.chat('I don\'t see you !')
        return
      }
      const p = target.position

      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
    }
    if (message.includes("pos")) {
      goHome()
    }
    if (message == "test") {
      storeItems()
    }
  })
})

bot.on("chat", (username, message) => {
  if (message.includes("is trying to trade with you.")) {
    isTrader(username)
  }
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)