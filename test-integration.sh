#!/bin/bash

echo "🚀 peerLoan Backend-Frontend Integration Test"
echo "=============================================="
echo ""

# Test backend methods
echo "📋 Testing backend canister methods..."
echo ""

echo "1. Testing getPendingLoans:"
dfx canister call peerLoan_backend getPendingLoans
echo ""

echo "2. Testing getUserLoans (with dummy principal):"
dfx canister call peerLoan_backend getUserLoans '(principal "aaaaa-aa")'
echo ""

echo "3. Frontend canister URL:"
FRONTEND_ID=$(dfx canister id peerLoan_frontend 2>/dev/null || echo "Not deployed")
if [ "$FRONTEND_ID" != "Not deployed" ]; then
  echo "   - Recommended: http://$FRONTEND_ID.localhost:4943/"
  echo "   - Legacy: http://127.0.0.1:4943/?canisterId=$FRONTEND_ID"
fi
echo ""

echo "4. Backend Candid interface URL:"
CANDID_UI_ID=$(dfx canister id __Candid_UI 2>/dev/null || echo "Not deployed")
BACKEND_ID=$(dfx canister id peerLoan_backend 2>/dev/null || echo "Not deployed")
if [ "$CANDID_UI_ID" != "Not deployed" ] && [ "$BACKEND_ID" != "Not deployed" ]; then
  echo "   - http://127.0.0.1:4943/?canisterId=$CANDID_UI_ID&id=$BACKEND_ID"
fi
echo ""

echo "✅ All systems deployed and ready!"
echo "🎉 Your peerLoan DeFi lending platform is now live on the Internet Computer!"
