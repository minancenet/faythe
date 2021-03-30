# Bot Process Planning

Faythe will function as a network of trading bots that will reside across the Hypixel numbered hub lobbies. Faythe bots will travel to a specified location in the lobby and then send their position to the runner/ user on the website. When the user is at the specified location they will initiate a trade with the Faythe bot and if the users credentials and trading items match up with the database the trade will be executed.

## Meta

- Player must be within 10 blocks of FaytheBot to execute a trade
- Items that overflow FaytheBot's inventory will go into the stash
  - Pickup items in the stash with /pickupstash
  - Unsure what the item stash limit is
- Trade is a 4x4 area allowing for a max of 16 stacks
- Jumbo Sack is a 9x6 area allowing for a max of 54 stacks

## Bot Inventory Management System

Using only Jumbo Sacks would allow FaytheBot to not have any island setup but would be costly and have a max limit of items

- 35 available slots in player inventory
- Use 17 for Jumbo Sacks
  - With 17 stacks FaytheBot can hold 918 stacks 58,752 items @ 64 per stack or 57.375 maxed trades
- Use 18 for inventory management (16 for max trade fill, 2 for buffer)

## Steps

1. Move to specified location
2. Wait for Hypixel to send a message that a user has requested a trade
3. Check if the requested trade is from the correct user
4. Check that the user has put the correct items into the bots inventory
5. Accept trade
6. Put items into jumbo sacs