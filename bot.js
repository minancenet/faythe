const mineflayer = require("mineflayer")
const pathfinder = require("mineflayer-pathfinder").pathfinder
const Movements = require("mineflayer-pathfinder").Movements
const { GoalXZ } = require("mineflayer-pathfinder").goals
const v = require("vec3")

const bot = mineflayer.createBot({
  host: "192.168.1.178",
  username: "FaytheWorker001",
  port: 56588,
  // password: "",
  // version: false,
  // auth: "mojang"
})

bot.loadPlugin(pathfinder)

let mcData
bot.once("inject_allowed", () => {
  mcData = require("minecraft-data")(bot.version)
})

bot.on("chat", (username, message) => {
  if (username == bot.username) return
  switch (true) {
    // Temporary testing commands
    case /^home$/.test(message):
      goHome()
      break
    
    case /^march$/.test(message):
      inventoryToChests()
  }
})

function inventoryToChests() {
  march()
  let sign = bot.findBlock({
    matching: mcData.blocksByName["wall_sign"].id,
    maxDistance: 3
  })
  if (!sign) { return }

  if (Math.ceil(sign.position.z) == Math.ceil(bot.entity.position.z)) {
    for (let i = 0; i < bot.inventory.items().length; i++) {
      if (sign.signText.includes(bot.inventory.items()[i].displayName)) {
        watchChest(v(sign.position.x+1, sign.position.y, sign.position.z))
        
      }
    }
  }
}

async function march() {
  moveTo(v(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z+1))
}

async function watchChest(chestPos) {
  let chestToOpen = bot.blockAt(chestPos)
  const chest = await bot.openChest(chestToOpen)

  function closeChest() {
    chest.close()
  }

  async function depositItem(name, amount) {
    // Move a specified item and amount into the chest

    const item = itemByName(chest.items(), name)
    if (item) {
      try {
        await chest.deposit(item.type, null, amount)
      } catch (err) {
        ;
      }
    } else {
      ;
    }
  }
}

function goHome() {
  // Temporary testing function
  // Replacing /warp home for Hypixel

  let target = bot.findBlock({
    matching: 152,
    maxDistance: 128
  })
  if (target) {
    let target = bot.findBlock({
      matching: 152,
      maxDistance: 128
    })
    
    moveTo(target.position)
  } else {
    return
  }
}

async function moveTo(pos) {
  // Moves bot to specified position

  const defaultMove = new Movements(bot, mcData)

  bot.pathfinder.setMovements(defaultMove)
  bot.pathfinder.setGoal(new GoalXZ(pos.x, pos.z))
}