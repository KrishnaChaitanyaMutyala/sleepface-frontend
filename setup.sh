#!/bin/bash

echo "🌟 Setting up Sleep Face project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB for the backend to work."
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
pip3 install -r requirements.txt
cd ..

echo "✅ Dependencies installed successfully!"

echo "🔧 Setting up environment variables..."

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "📝 Created backend/.env file. Please update it with your configuration."
fi

echo "🚀 Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev          # Start both backend and frontend"
echo "  npm run dev:backend  # Start only backend"
echo "  npm run dev:frontend # Start only frontend"
echo ""
echo "Next steps:"
echo "1. Set up Firebase project and add serviceAccountKey.json to backend/"
echo "2. Update backend/.env with your configuration"
echo "3. Start MongoDB"
echo "4. Run 'npm run dev' to start development"
echo ""
echo "Happy coding! 🌟"
