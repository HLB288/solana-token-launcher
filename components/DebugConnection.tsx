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
  
  // Assurez-vous que le composant n'est rendu que côté client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!mounted || !publicKey) return;
    
    // Vérifier le endpoint de connexion
    setConnectionDetails(`Endpoint: ${connection.rpcEndpoint}`);
    
    // Vérifier le solde sur mainnet
    const checkMainnetBalance = async () => {
      try {
        const mainnetConn = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        console.log("Tentative de récupération du solde pour:", publicKey.toString());
        const balance = await mainnetConn.getBalance(publicKey);
        console.log("Solde récupéré:", balance / LAMPORTS_PER_SOL, "SOL");
        setMainnetBalance(balance / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error('Erreur mainnet:', err);
      }
    };
    
    checkMainnetBalance();
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
      <div><strong>Adresse:</strong> {publicKey.toString()}</div>
      <div><strong>Connexion:</strong> {connectionDetails}</div>
      <div><strong>Solde Mainnet:</strong> {mainnetBalance !== null ? mainnetBalance.toFixed(6) : 'Chargement...'} SOL</div>
    </div>
  );
}