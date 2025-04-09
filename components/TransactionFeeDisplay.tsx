// components/TransactionFeeDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface TransactionFeeDisplayProps {
  className?: string;
}

export default function TransactionFeeDisplay({ className = '' }: TransactionFeeDisplayProps) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const fixedFee = 0.005; // Fixed fee display as requested

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
    // Set up a refresh interval
    const intervalId = setInterval(fetchBalance, 30000); // Refresh every 30 seconds

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
          Estimated fees: <span className="sol-amount">{fixedFee.toFixed(6)} SOL</span>
        </p>
      </div>
      
      <p className="fee-note">Fees on mainnet are real and non-refundable.</p>
    </div>
  );
}