# Monad Portfolio Tracker

This project is a server built for the MCP Madness challenge to help users track and manage their MON tokens on the Monad Testnet. It’s designed to work seamlessly with Claude Desktop or Cursor IDE, allowing users to interact with the Monad Testnet using simple, natural language prompts.

## 🚀 Features

- ✅ Check your MON balance.
- 📜 View recent transactions.
- 📊 Get a portfolio summary.
- 🔁 Simulate sending MON.
- 🚨 Set low balance alerts.
- 🌟 **Bonus**: Full portfolio overview in one request (combines balance, history, and simulation).

## ⚙️ Setup

1. Clone this repository:
First, download the project files to your computer by running this command in your terminal:
   ```
   git clone https://github.com/wizbisy/Mcp.git
   cd Mcp

2. install dependencies:
Run the setup script to install everything the project needs:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```
This will install Node.js packages like Express, Ethers.js, and TypeScript.

3. Start the server:
Launch the server with this command:
   ```
   npm start 
   ```
You’ll see a message saying the server is running at http://localhost:3000.

4. Connect to Claude Desktop or Cursor IDE
Open Claude Desktop or Cursor IDE on your computer. In the IDE settings, find the option to connect to an MCP server (this might be under "Tools" or "Agent Mode"). Enter the server address http://localhost:3000 to connect. If you're running the server on a remote machine or in a cloud environment like GitHub Codespaces, you may need to use a public URL instead—check your environment’s port settings to get the correct URL.


💬 Example Prompts
Use these in Claude Desktop or Cursor IDE to interact with the server:
   ```
Check my MON balance for address 0xYourAddress
   ```
   ```
   View my transaction history for address 0xYourAddress
   ```
   ```
   Show my portfolio stats for address 0xYourAddress
   ```
   ```
   Simulate sending 50 MON from 0xYourAddress to 0xAnotherAddress
   ```
   ```
   Set a low balance alert for address 0xYourAddress at 10 MON
   ```
   ```
   Give me a full portfolio overview for address 0xYourAddress with simulateTo 0xAnotherAddress and simulateAmount 50
   ```
📌 Notes
RPC URL: The server uses [my custom quick node rpc url](https://shy-polished-sound.monad-testnet.quiknode.pro/80816883909f333b81f1c58ff02c73e8bd5b70a1/). 

Testnet MON: Get free MON from the Monad Faucet: https://testnet.monad.xyz

Dependencies: Installed via setup.sh
(includes: Node.js, Express, Ethers.js, TypeScript)

👨‍💻 Author
Built with 💙 by wizbisy for the MCP Madness challenge.
