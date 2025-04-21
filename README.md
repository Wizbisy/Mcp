# Monad MCP Server


A lightweight server for the MCP Madness challenge to track MON tokens on the Monad Testnet. Built to work with Claude Desktop or Cursor IDE.

## 🚀 Features

- ✅ Check your MON balance.
- 📜 View recent transactions.
- 📊 Get a portfolio summary.
- 🔁 Simulate sending MON.
- 🚨 Set low balance alerts.
- 🌟 **Bonus**: Full portfolio overview in one request (combines balance, history, and simulation).

## ⚙️ Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/wizbisy/MCP.git
   cd MCP
Run the setup script:

bash setup.sh
Start the server:

npm start
The server will run on:
👉 http://localhost:3000

Connect with Claude Desktop or Cursor IDE:

Configure Claude or Cursor to send requests to:
http://localhost:3000

💬 Example Prompts
Use these in Claude Desktop or Cursor IDE to interact with the server:

"Check my MON balance for address 0xYourAddress..."

"View my transaction history for address 0xYourAddress..."

"Show my portfolio stats for address 0xYourAddress..."

"Simulate sending 50 MON from 0xYourAddress... to 0xAnotherAddress..."

"Set a low balance alert for address 0xYourAddress... at 10 MON"

"Give me a full portfolio overview for address 0xYourAddress... with simulateTo 0xAnotherAddress... and simulateAmount 50"

📌 Notes
Testnet MON: Get free MON from the Monad Faucet: https://testnet.monad.xyz

Dependencies: Installed via setup.sh
(includes: Node.js, Express, Ethers.js, TypeScript)

📝 Submission Info
This project is submitted for MCP Madness Dev Community Mission #2, due April 30, 2025.
It meets all core and bonus requirements:

✅ Open source on GitHub

✅ Interacts with the Monad Testnet

✅ Claude/Cursor compatible via MCP protocol

✅ Executes chained actions (full-portfolio-overview)

✅ One-line install with setup.sh

👨‍💻 Author
Built with 💙 by wizbisy for the MCP Madness challenge.