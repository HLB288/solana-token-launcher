'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL, Connection, clusterApiUrl } from '@solana/web3.js';

export default function DebugConnection() {
  const { connection } = useConnection();
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
    
    // Check connection endpoint
    setConnectionDetails(`Endpoint: ${connection.rpcEndpoint}`);
    
    // Check mainnet balance with fallbacks
    const checkMainnetBalance = async () => {
      setIsLoading(true);
      try {
        // List of fallback endpoints
        const endpoints = [
          connection.rpcEndpoint, // Try the current connection first
          'https://api.mainnet-beta.solana.com',
          'https://solana-mainnet.g.alchemy.com/v2/demo',
          'https://solana-api.projectserum.com'
        ];
        
        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`Attempting to get balance using endpoint: ${endpoint}`);
            const conn = new Connection(endpoint, 'confirmed');
            const balance = await conn.getBalance(publicKey);
            console.log(`Balance retrieved: ${balance / LAMPORTS_PER_SOL} SOL from ${endpoint}`);
            setMainnetBalance(balance / LAMPORTS_PER_SOL);
            setIsLoading(false);
            return; // Exit the function if successful
          } catch (endpointError) {
            console.error(`Error with endpoint ${endpoint}:`, endpointError);
            // Continue to next endpoint
          }
        }
        
        // If we get here, all endpoints failed
        console.error('All endpoints failed to retrieve balance');
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
  }, [publicKey, connection, mounted]);

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