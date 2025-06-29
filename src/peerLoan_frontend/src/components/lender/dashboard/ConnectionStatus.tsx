
import React, { useState, useEffect } from 'react';
import { checkSupabaseConnection } from '@/lib/supabase';
import { isIcpEnabled } from '@/services/loans/icp/utils';

const ConnectionStatus: React.FC = () => {
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [icpConnected, setIcpConnected] = useState<boolean>(isIcpEnabled());
  
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      setSupabaseConnected(connected);
      
      // Check ICP status
      setIcpConnected(isIcpEnabled());
    };
    
    checkConnection();
  }, []);
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {supabaseConnected !== null && (
        <div className={`text-sm px-4 py-2 rounded-md ${supabaseConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} flex-1`}>
          {supabaseConnected 
            ? "✅ Verification: Connected to Supabase" 
            : "⚠️ Verification: Using local storage"}
        </div>
      )}
      
      <div className={`text-sm px-4 py-2 rounded-md ${icpConnected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} flex-1`}>
        {icpConnected 
          ? "✅ Loans: Connected to ICP blockchain" 
          : "⚠️ Loans: Using local storage (ICP pending)"}
      </div>
    </div>
  );
};

export default ConnectionStatus;
