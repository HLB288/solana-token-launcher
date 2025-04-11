// providers/SolanaProvider.tsx
'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  // Force EXPLICITLY mainnet
  const network = WalletAdapterNetwork.Mainnet;
  
  // Use a reliable public RPC or your own RPC
  const endpoint = useMemo(() => {
    console.log("Initializing SolanaProvider with mainnet network");
    
    // Try to use Helius first, then fall back to public endpoint
    const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
    const publicEndpoint = clusterApiUrl('mainnet-beta');
    
    // Return Helius if available, otherwise use public endpoint
    return heliusEndpoint || publicEndpoint;
  }, []);
  
  // Initialize available wallets
  const wallets = useMemo(() => {
    console.log("Initializing wallets for network:", network);
    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ];
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};