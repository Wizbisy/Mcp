#!/bin/bash

echo "📦 Installing dependencies..."
npm install zod
npm install --save-dev express ethers typescript ts-node @types/node @types/express

echo "🛠️ Compiling TypeScript config..."
npx tsc --init

# Overwrite tsconfig.json with the right ESM-compatible config
cat <<EOT > tsconfig.json
{
 "compilerOptions": {
 "target": "ES2020",
 "module": "ESNext",
 "outDir": "./dist",
 "rootDir": "./",
 "strict": true,
 "esModuleInterop": true,
 "skipLibCheck": true,
 "forceConsistentCasingInFileNames": true,
 "moduleResolution": "node"
 }
}
EOT

# Overwrite package.json if needed
echo "📝 Updating package.json..."
jq '.scripts.start = "node --loader ts-node/esm index.ts" | .type = "module"' package.json > temp.json && mv temp.json package.json

echo "✅ Setup complete! You can run the server with:"
echo "   npm start"
