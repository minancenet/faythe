const mineflayer = require("mineflayer")
const pathfinder = require("mineflayer-pathfinder").pathfinder
const Movements = require("mineflayer-pathfinder").Movements
const { GoalNear } = require("mineflayer-pathfinder").goals
const v = require("vec3")

const bot = mineflayer.createBot({
  host: "192.168.1.178",
  username: "FaytheWorker001",
  port: 55897,
  // password: "",
  // version: false,
  // auth: "mojang"
})

bot.loadPlugin(pathfinder)

let mcData
bot.once('inject_allowed', () => {
  mcData = require('minecraft-data')(bot.version)
})

bot.on("chat", (username, message) => {
  if (username == bot.username) return
  switch (true) {
    case /^chest$/.test(message):
      watchChest(["chest", "trapped_chest"])
      break

    // Temporary testing commands
    case /^home$/.test(message):
      goHome()
      break
    
    case /^sort$/.test(message):
      inventoryToChests()
      break
  }
})

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

async function inventoryToChests() {
  // Sort away all inventory items into chests

  let items = bot.inventory.items()
  console.log(items)
  let item = itemByName(items, "cobblestone")
  console.log(item)
  console.log(findChest(item))
}

function findChest(item) {
  let chestSigns = bot.findBlocks({
    matching: mcData.blocksByName["wall_sign"].id,
    maxDistance: 256,
    count: 256
  })
  console.log(chestSigns)

  let sign
  for (var i = 0; i < chestSigns.length; i++) {
    sign = bot.blockAt(chestSigns[i])
    if (sign.signText.includes(item.displayName)) {
      return getChestSign(sign.position)
    }
  }
  return null
}

async function watchChest(blocks=[]) {
  let chestToOpen = bot.findBlock({
    matching: blocks.map(name => mcData.blocksByName[name].id),
    maxDistance: 6
  })
  const chest = await bot.openChest(chestToOpen)
  console.log(chest.containerItems())

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

async function getChestSign(signPos) {
  // Find the chest that the sign is attached to

  bot.lookAt(signPos)
  let direction = isFacing()
  let pos
  if (direction == "north") {
    pos = v(signPos.x, signPos.y, signPos.z-1)
  } else if (direction == "east") {
    pos = v(signPos.x, signPos.y, signPos.z+1)
  } else if (direction == "south") {
    pos = v(signPos.x-1, signPos.y, signPos.z)
  } else if (direction == "west") {
    pos = v(signPos.x-1, signPos.y, signPos.z)
  } else {
    pos = null
  }
  
  return pos
}

async function moveTo(pos) {
  // Moves bot to specified position

  const defaultMove = new Movements(bot, mcData)

  bot.pathfinder.setMovements(defaultMove)
  bot.pathfinder.setGoal(new GoalNear(pos.x, pos.y+1, pos.z, 0))
}

function itemInSign(name) {
  ;
}

function isFacing() {
  // Algorithm to tell which way the bot is facing
  // Used to determine what the position of the chest behind the sign is

  let blockPos = bot.blockAtCursor().position
  let playerPos = bot.entity.position

  if (playerPos.x > blockPos.x) {
    return "west"
  } else if (playerPos.x < blockPos.x) {
    return "east"
  } else if (playerPos.z > blockPos.z) {
    return "north"
  } else if (playerPos.z < blockPos.z) {
    return "south"
  } else {
    return null
  }
}

function itemByName(items, name) {
  // Get item by name from a list of items

  let item
  let i
  for (i = 0; i < items.length; i++) {
    item = items[i]
    if (item && item.name == name) return item
  }
  return null
}