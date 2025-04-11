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
  
  // Use a reliable public RPC or your own RPC with fallback mechanism
  const endpoint = useMemo(() => {
    console.log("Initializing SolanaProvider with mainnet network");
    
    // Définir plusieurs endpoints comme fallback
    const endpoints = [
      process.env.NEXT_PUBLIC_HELIUS_RPC_URL,
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      clusterApiUrl('mainnet-beta')
    ].filter(Boolean) as string[]; // Filtrer les endpoints undefined
    
    // Retourner le premier endpoint (on pourra tester les autres si celui-ci échoue)
    return endpoints[0];
  }, []);
  
  // Liste des fallbacks pour utilisation dans d'autres composants
  const fallbackEndpoints = useMemo(() => {
    return [
      process.env.NEXT_PUBLIC_HELIUS_RPC_URL, 
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      clusterApiUrl('mainnet-beta')
    ].filter(Boolean) as string[];
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

// Exporter la liste des endpoints de fallback
export const getFallbackEndpoints = () => {
  return [
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL, 
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
    clusterApiUrl('mainnet-beta')
  ].filter(Boolean) as string[];
};