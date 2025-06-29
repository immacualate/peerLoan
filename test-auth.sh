#!/bin/bash

echo "🚀 Testing peerLoan Internet Identity Authentication"
echo "=================================================="

# Check if dfx is running
echo "📡 Checking dfx status..."
if ! dfx ping > /dev/null 2>&1; then
    echo "❌ dfx is not running. Please start dfx first."
    exit 1
fi
echo "✅ dfx is running"

# Check canister status
echo "🔍 Checking canister status..."
backend_status=$(dfx canister status peerLoan_backend 2>/dev/null | grep "Status:" | cut -d' ' -f2)
frontend_status=$(dfx canister status peerLoan_frontend 2>/dev/null | grep "Status:" | cut -d' ' -f2)

if [ "$backend_status" = "Running" ]; then
    echo "✅ Backend canister is running"
else
    echo "❌ Backend canister is not running: $backend_status"
fi

if [ "$frontend_status" = "Running" ]; then
    echo "✅ Frontend canister is running"
else
    echo "❌ Frontend canister is not running: $frontend_status"
fi

# Get canister IDs
backend_id=$(dfx canister id peerLoan_backend 2>/dev/null)
frontend_id=$(dfx canister id peerLoan_frontend 2>/dev/null)

echo "📋 Canister Information:"
echo "   Backend ID: $backend_id"
echo "   Frontend ID: $frontend_id"

# Check deployed frontend URL
echo "🌐 Frontend URLs:"
echo "   Local Dev: http://localhost:3000"
echo "   Deployed: https://$frontend_id.ic0.app"

# Test backend connectivity
echo "🧪 Testing backend connectivity..."
if timeout 10 dfx canister call peerLoan_backend whoami 2>/dev/null; then
    echo "✅ Backend canister is responding"
else
    echo "⚠️  Backend canister might not be responding (this is ok for anonymous calls)"
fi

echo ""
echo "🎯 Internet Identity Test Instructions:"
echo "1. Open the frontend in your browser: http://localhost:3000"
echo "2. Look for the 'Connect Internet Identity' button in the top-right"
echo "3. Click the button to test the authentication flow"
echo "4. A new window should open to https://identity.ic0.app"
echo "5. Complete the Internet Identity authentication"
echo "6. You should be redirected back and see your principal ID"
echo ""
echo "📝 Expected Behavior:"
echo "   ✓ Button should show 'Connecting...' during the process"
echo "   ✓ Internet Identity window opens at https://identity.ic0.app"
echo "   ✓ After auth, button changes to show user info"
echo "   ✓ Principal ID should be displayed (format: xxxxx-xxxxx-xxxxx-...)"
echo "   ✓ Toast notification confirms successful connection"
echo ""
echo "🔧 Configuration Summary:"
echo "   • Using public Internet Identity: https://identity.ic0.app"
echo "   • Derivation origin: https://$frontend_id.ic0.app"
echo "   • Network: ICP Mainnet (for Internet Identity)"
echo "   • Local development server: http://localhost:3000"
echo ""
echo "Ready to test! Open http://localhost:3000 in your browser."
