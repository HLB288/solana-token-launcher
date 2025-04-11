// components/DebugConnection.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { BalanceService } from '../services/balance-service';

export default function DebugConnection() {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [mainnetBalance, setMainnetBalance] = useState<number | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure the component is only rendered client-side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted || !publicKey) return;
    
    // Set connection details
    setConnectionDetails(`Endpoint: mainnet (multi-RPC fallback)`);
    
    // Check mainnet balance with our balance service
    const checkMainnetBalance = async () => {
      setIsLoading(true);
      try {
        const balance = await BalanceService.getBalance(publicKey);
        setMainnetBalance(balance);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking mainnet balance:', err);
        setIsLoading(false);
      }
    };
    
    checkMainnetBalance();
    
    // Set up periodic balance checking
    const intervalId = setInterval(checkMainnetBalance, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [publicKey, mounted]);

  if (!mounted || !publicKey) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.7)', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px',
      color: 'white'
    }}>
      <div><strong>Address:</strong> {publicKey.toString()}</div>
      <div><strong>Connection:</strong> {connectionDetails}</div>
      <div>
        <strong>Mainnet Balance:</strong> {isLoading 
          ? 'Loading...' 
          : mainnetBalance !== null 
            ? mainnetBalance.toFixed(6) 
            : 'Failed to load'} SOL
      </div>
    </div>
  );
}