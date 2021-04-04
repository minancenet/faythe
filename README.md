# Minance Escrow Bot

Minance functions as an external, peer-peer marketplace exchange for Hypixel Bazaar assets while also providing simple data visualization and analysis.

The Minance Faythe Bot is responsible for executing all trades on behalf of Minance along with storing user items.

## Central Command Server

The central command server will act as a command center for all Minance bot's on the network.

### Tasks

- Hand out user orders to individual Minance bots.
- Hand out tasks such as storing and arranging items.
- Communicate with the web server to receive user orders.
- Communicate with the web server to send bot activity and statistics.

## Bot Storage System

The bot storage system will be a modular chest storage system that will store Minance users assets.

### Tasks

- Allow bots to build storage modules and interconnect them.
- Allow bots to traverse network and deposit/ withdraw items from the system.

## User-Bot Trading System

The user-bot trading system will allow users to deposit and withdraw items from their Minance accounts.

### Tasks

- Accept trade orders from the central command server.
- Execute trade orders by moving to the specified hub and location.