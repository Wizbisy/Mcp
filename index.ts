import express from "express";
import { ethers } from "ethers";
import { z } from "zod";
import axios from "axios";

const app = express();
const port = 3000;
app.use(express.json());

const monadRpcUrl = "https://shy-polished-sound.monad-testnet.quiknode.pro/80816883909f333b81f1c58ff02c73e8bd5b70a1/"; 
const blockscoutApiUrl = "https://api.socialscan.io/monad-testnet"; 

let provider: ethers.JsonRpcProvider;
try {
  provider = new ethers.JsonRpcProvider(monadRpcUrl);
  provider.getBlockNumber().then(block => {
    console.log(`Successfully connected to Monad Testnet. Latest block: ${block}`);
  }).catch(err => {
    console.error(`Failed to connect to Monad Testnet: ${err.message}`);
    console.error("Please try an alternative RPC provider or check your network connection.");
  });
} catch (err) {
  console.error(`Error initializing provider with Envio RPC: ${err.message}`);
  process.exit(1); 
}

const balanceAlerts = new Map<string, { address: string; threshold: number }>();

function formatNumber(num: number): string {
  return num.toFixed(2);
}

async function fetchTransactionHistory(address: string, limit: number = 5): Promise<string[]> {
  try {
    const response = await axios.get(`${blockscoutApiUrl}?module=account&action=txlist&address=${address}&sort=desc`);
    const transactions = response.data.result || [];
    const history: string[] = [];

    for (const tx of transactions.slice(0, limit)) {
      const valueMon = parseFloat(ethers.formatEther(tx.value));
      const direction = tx.from.toLowerCase() === address.toLowerCase() ? "Sent" : "Received";
      history.push(`${direction} ${formatNumber(valueMon)} MON ${tx.to ? `to/from ${tx.to}` : ""} (Hash: ${tx.hash.slice(0, 10)}...)`);
    }

    return history;
  } catch (err) {
    console.error(`Error fetching transaction history from Blockscout: ${err.message}`);
    return [];
  }
}

app.post("/mcp/capabilities", (_req, res) => {
  const capabilitiesList = [
    { name: "check-mon-balance", description: "Get your MON balance for an address" },
    { name: "view-transaction-history", description: "See your recent transactions on Monad Testnet" },
    { name: "portfolio-stats", description: "Get a summary of your portfolio" },
    { name: "simulate-tx", description: "Simulate sending MON to another address" },
    { name: "set-low-balance-alert", description: "Get notified if your balance drops too low" },
    { name: "full-portfolio-overview", description: "Get balance, transaction history, and simulate a transaction in one go" },
  ];
  res.json({ capabilities: capabilitiesList });
});

app.post("/mcp/execute", async (req, res) => {
  const { capability, params } = req.body;

  try {
    switch (capability) {
      case "check-mon-balance": {
        const schema = z.object({ address: z.string().startsWith("0x").length(42) });
        const { address } = schema.parse(params);

        const balanceWei = await provider.getBalance(address);
        const balanceMon = parseFloat(ethers.formatEther(balanceWei));
        res.json({ result: `Your balance is ${formatNumber(balanceMon)} MON.` });
        break;
      }

      case "view-transaction-history": {
        const schema = z.object({ address: z.string().startsWith("0x").length(42) });
        const { address } = schema.parse(params);

        const history = await fetchTransactionHistory(address, 5);
        res.json({ result: history.length ? history.join("\n") : "No recent transactions found." });
        break;
      }

      case "portfolio-stats": {
        const schema = z.object({ address: z.string().startsWith("0x").length(42) });
        const { address } = schema.parse(params);

        const balanceWei = await provider.getBalance(address);
        const txCount = await provider.getTransactionCount(address);
        const balanceMon = parseFloat(ethers.formatEther(balanceWei));

        res.json({
          result: `Portfolio Summary:\n- Total MON: ${formatNumber(balanceMon)}\n- Total Transactions: ${txCount}\n- Estimated Fees Paid: ${formatNumber(txCount * 0.01)} MON`,
        });
        break;
      }

      case "simulate-tx": {
        const schema = z.object({
          from: z.string().startsWith("0x").length(42),
          to: z.string().startsWith("0x").length(42),
          amount: z.number().positive(),
        });
        const { from, to, amount } = schema.parse(params);

        const amountWei = ethers.parseEther(amount.toString());
        const gasEstimate = await provider.estimateGas({ from, to, value: amountWei });
        const gasMon = parseFloat(ethers.formatEther(gasEstimate));
        const balanceWei = await provider.getBalance(from);
        const balanceMon = parseFloat(ethers.formatEther(balanceWei));
        const newBalance = balanceMon - amount - gasMon;

        res.json({
          result: `Simulated Transaction:\n- Amount: ${amount} MON\n- Estimated Gas: ${formatNumber(gasMon)} MON\n- New Balance: ${formatNumber(newBalance)} MON`,
        });
        break;
      }

      case "set-low-balance-alert": {
        const schema = z.object({
          address: z.string().startsWith("0x").length(42),
          threshold: z.number().positive(),
        });
        const { address, threshold } = schema.parse(params);

        balanceAlerts.set(address, { address, threshold });
        const balanceWei = await provider.getBalance(address);
        const balanceMon = parseFloat(ethers.formatEther(balanceWei));

        const msg =
          balanceMon < threshold
            ? `Alert! Your balance (${formatNumber(balanceMon)} MON) is below ${threshold} MON.`
            : `Alert set! I’ll notify you if your balance drops below ${threshold} MON.`;

        res.json({ result: msg });
        break;
      }

      case "full-portfolio-overview": {
        const schema = z.object({
          address: z.string().startsWith("0x").length(42),
          simulateTo: z.string().startsWith("0x").length(42),
          simulateAmount: z.number().positive(),
        });
        const { address, simulateTo, simulateAmount } = schema.parse(params);

        const balanceWei = await provider.getBalance(address);
        const balanceMon = parseFloat(ethers.formatEther(balanceWei));
        const txCount = await provider.getTransactionCount(address);
        
        const history = await fetchTransactionHistory(address, 3);

        const amountWei = ethers.parseEther(simulateAmount.toString());
        const gasEstimate = await provider.estimateGas({ from: address, to: simulateTo, value: amountWei });
        const gasMon = parseFloat(ethers.formatEther(gasEstimate));
        const newBalance = balanceMon - simulateAmount - gasMon;

        const overview = [
          `Balance: ${formatNumber(balanceMon)} MON`,
          `Recent Transactions (${history.length}):`,
          history.length ? history.join("\n") : "No recent transactions found.",
          `Simulated Sending ${simulateAmount} MON to ${simulateTo}:`,
          `- Estimated Gas: ${formatNumber(gasMon)} MON`,
          `- New Balance: ${formatNumber(newBalance)} MON`,
        ];

        res.json({ result: `Full Portfolio Overview:\n${overview.join("\n")}` });
        break;
      }

      default:
        res.status(400).json({ error: "That capability isn’t supported. Check /mcp/capabilities for valid options." });
    }
  } catch (err) {
    res.status(500).json({ error: `Error executing ${capability}: ${(err as Error).message}` });
  }
});

setInterval(async () => {
  for (const [_, { address, threshold }] of balanceAlerts.entries()) {
    try {
      const balanceWei = await provider.getBalance(address);
      const balanceMon = parseFloat(ethers.formatEther(balanceWei));
      if (balanceMon < threshold) {
        console.log(`🔔 ALERT: ${address} balance (${formatNumber(balanceMon)} MON) is below threshold (${threshold})`);
      }
    } catch (e) {
      console.error(`Failed to check balance for ${address}: ${(e as Error).message}`);
    }
  }
}, 60000); 

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port} - get your portfolio stats! 🌟`);
});
