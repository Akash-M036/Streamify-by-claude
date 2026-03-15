#!/bin/bash
# =====================================================
# Streamify - MongoDB Setup Script
# Run this once to install & start MongoDB locally
# =====================================================

echo "🍃 Setting up MongoDB for Streamify..."

# Detect OS
OS="$(uname -s)"

if [[ "$OS" == "Darwin" ]]; then
  echo "📦 macOS detected — using Homebrew"
  if ! command -v brew &>/dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  echo "✅ MongoDB installed and started on macOS"

elif [[ "$OS" == "Linux" ]]; then
  echo "📦 Linux detected"
  sudo apt-get install -y gnupg curl
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo systemctl start mongod
  sudo systemctl enable mongod
  echo "✅ MongoDB installed and started on Linux"

else
  echo "⚠️  Windows detected — please install MongoDB manually:"
  echo "   1. Go to: https://www.mongodb.com/try/download/community"
  echo "   2. Download MongoDB Community Server (Windows)"
  echo "   3. Run the installer (choose 'Complete' setup)"
  echo "   4. Make sure 'Install MongoDB as a Service' is checked"
  echo "   5. MongoDB will start automatically"
fi

echo ""
echo "🔗 MongoDB URI: mongodb://localhost:27017/ottplatform"
echo "✅ Done! Run the app with: ./start.sh"
