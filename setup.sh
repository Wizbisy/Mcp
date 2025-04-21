#!/bin/bash

echo "📦 Installing dependencies..."
npm install express ethers typescript ts-node @types/node

echo "🛠️ Compiling TypeScript..."
npx tsc --init

echo "✅ Setup complete. Run the server with:"
echo "   npm start"
