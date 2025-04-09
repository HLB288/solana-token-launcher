// providers/SolanaProvider.tsx
'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Importez les styles du wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  // Forcer EXPLICITEMENT le mainnet
  const network = WalletAdapterNetwork.Mainnet;
  
  // Utiliser un RPC public fiable ou votre propre RPC
  const endpoint = useMemo(() => {
    console.log("Initialisation SolanaProvider avec réseau mainnet via Helius");
    return process.env.NEXT_PUBLIC_HELIUS_RPC_URL || clusterApiUrl('mainnet-beta');
  }, []);
  
  // Initialiser les wallets disponibles
  const wallets = useMemo(() => {
    console.log("Initialisation des wallets pour le réseau:", network);
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