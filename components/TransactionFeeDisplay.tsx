// components/TransactionFeeDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { BalanceService } from '../services/balance-service';

interface TransactionFeeDisplayProps {
  className?: string;
}

export default function TransactionFeeDisplay({ className = '' }: TransactionFeeDisplayProps) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [estimatedFee, setEstimatedFee] = useState<number>(0.005); // Valeur par défaut
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBalanceAndFees = async () => {
      if (publicKey) {
        try {
          setIsLoading(true);
          
          // Récupérer le solde avec notre service robuste
          const bal = await BalanceService.getBalance(publicKey);
          setBalance(bal);
          
          // Estimer les frais d'une transaction typique de création de token
          const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
          
          // Créer une transaction pour l'estimation
          const transaction = new Transaction();
          
          // Ajouter quelques instructions typiques pour simuler une création de token
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: PublicKey.default,
              lamports: 1000
            })
          );
          
          transaction.recentBlockhash = blockhash;
          transaction.lastValidBlockHeight = lastValidBlockHeight;
          transaction.feePayer = publicKey;
          
          // Estimer les frais
          const fees = await connection.getFeeForMessage(
            transaction.compileMessage(),
            'confirmed'
          );
          
          // Si l'estimation réussit, utiliser cette valeur
          if (fees && fees.value) {
            // Ajouter une marge de sécurité pour les transactions complexes (comme la création de token)
            const feeWithMargin = (fees.value * 5) / LAMPORTS_PER_SOL; // Multiplier par 5 pour une estimation conservative
            setEstimatedFee(Math.max(feeWithMargin, 0.005)); // Ne pas descendre en dessous de 0.005 SOL
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching balance or estimating fees:', error);
          setEstimatedFee(0.005); // Valeur par défaut en cas d'erreur
          setIsLoading(false);
        }
      } else {
        setBalance(null);
        setIsLoading(false);
      }
    };

    fetchBalanceAndFees();
    
    // Configurer un rafraîchissement périodique
    const intervalId = setInterval(fetchBalanceAndFees, 15000); // Toutes les 15 secondes

    return () => clearInterval(intervalId);
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <div className={`transaction-fee-container ${className}`}>
      <h3 className="fee-title">Transaction Fees</h3>
      
      <div className="fee-info">
        <p className="current-balance">
          Current balance: <span className="sol-amount">{balance !== null ? balance.toFixed(6) : '0.000000'} SOL</span>
        </p>
        <p className="estimated-fee">
          Estimated fees: <span className="sol-amount">
            {isLoading ? 'Calculating...' : `${estimatedFee.toFixed(6)} SOL`}
          </span>
        </p>
      </div>
      
      <p className="fee-note">Fees on mainnet are real and non-refundable.</p>
    </div>
  );
}