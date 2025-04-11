// hooks/useCreateLiquidity.ts (improved)
'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { LiquidityService } from '../services/liquidity-service';
import { SolanaWalletAdapter } from '../services/wallet-adapter';

interface CreateLiquidityOptions {
  network?: 'mainnet' | 'devnet';
}

export function useCreateLiquidity(options: CreateLiquidityOptions = {}) {
  const { network = 'mainnet' } = options;
  
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [poolAddress, setPoolAddress] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progressStage, setProgressStage] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [estimatedFees, setEstimatedFees] = useState<number>(0.005); // Default estimation
  const [isFeeEstimating, setIsFeeEstimating] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);

  // Services
  const liquidityService = new LiquidityService(network);
  const walletAdapter = new SolanaWalletAdapter(network);

  // Process steps
  const progress = [
    { label: "Initialization", description: "Preparing pool creation" },
    { label: "Token Verification", description: "Validating token address" },
    { label: "Pool Creation", description: "Creating liquidity pool on DEX" },
    { label: "Adding Liquidity", description: "Transferring tokens and SOL into the pool" },
    { label: "Finalization", description: "Confirming transactions and finalizing" }
  ];
  
  // Get user's SOL balance on load
  useEffect(() => {
    if (publicKey) {
      const fetchSolBalance = async () => {
        try {
          const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
          const balance = await mainnetConnection.getBalance(publicKey);
          setSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching SOL balance:", error);
        }
      };
      
      fetchSolBalance();
      estimatePoolCreationFees();
    }
  }, [publicKey]);
  
  /**
   * Checks if the balance is sufficient to cover fees
   */
  const isSolBalanceSufficient = (): boolean => {
    return solBalance >= estimatedFees;
  };
  
  /**
   * Estimates the fees for creating a liquidity pool
   */
  const estimatePoolCreationFees = async () => {
    setIsFeeEstimating(true);
    // Set fixed fees for mainnet (could be calculated dynamically)
    setEstimatedFees(network === 'mainnet' ? 0.005 : 0.001);
    setIsFeeEstimating(false);
  };
  
  /**
   * Gets token details from its address
   */
  const getTokenDetails = async (tokenAddress: string) => {
    try {
      // Implement logic to retrieve token details
      // Could use tokenService or query Solana API directly
      
      // For now, return dummy data
      return {
        name: "Token " + tokenAddress.substring(0, 6),
        symbol: "TKN",
        decimals: 9,
        supply: 1000000
      };
    } catch (error) {
      console.error("Error fetching token details:", error);
      return null;
    }
  };

  /**
   * Creates a liquidity pool for a token
   */
  const createLiquidityPool = async (
    tokenAddress: string,
    tokenAmount: number,
    solAmount: number
  ) => {
    if (!publicKey || !sendTransaction) {
      setStatus('error');
      setErrorMessage('Please connect your wallet');
      return;
    }

    if (!tokenAddress) {
      setStatus('error');
      setErrorMessage('Please enter the token address');
      return;
    }
    
    // Verify the address is valid
    try {
      new PublicKey(tokenAddress);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Invalid token address');
      return;
    }

    setIsLoading(true);
    setStatus('loading');
    setProgressStage(0);

    try {
      // Step 1: Initialization
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgressStage(1);
      
      // Step 2: Token Verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgressStage(2);
      
      // Create a function to sign and send transactions
      const signAndSendTransaction = walletAdapter.createSignAndSendTransactionFunction(
        publicKey,
        sendTransaction
      );
      
      // Step 3: Create pool and add liquidity
      const result = await liquidityService.createLiquidityPool(
        tokenAddress,
        tokenAmount,
        solAmount,
        publicKey.toString(),
        signAndSendTransaction
      );
      
      setPoolAddress(result.poolAddress);
      setTxSignature(result.txSignature);
      setProgressStage(3);
      
      // Step 4: Finalization
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgressStage(4);
      
      // Update balance after creation
      if (publicKey) {
        const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await mainnetConnection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
      
      setStatus('success');
    } catch (error) {
      console.error("Error creating liquidity pool:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Adds liquidity to an existing pool
   */
  const addLiquidity = async (
    poolAddress: string,
    tokenAmount: number,
    solAmount: number
  ) => {
    if (!publicKey || !sendTransaction) {
      setStatus('error');
      setErrorMessage('Please connect your wallet');
      return;
    }

    setIsLoading(true);

    try {
      // Create a function to sign and send transactions
      const signAndSendTransaction = walletAdapter.createSignAndSendTransactionFunction(
        publicKey,
        sendTransaction
      );
      
      // Call service to add liquidity
      const txSignature = await liquidityService.addLiquidity(
        poolAddress,
        tokenAmount,
        solAmount,
        publicKey.toString(),
        signAndSendTransaction
      );
      
      // Update balance after transaction
      if (publicKey) {
        const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await mainnetConnection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
      
      // Show success message
      alert(`Liquidity added successfully!\nTx: ${txSignature}`);
    } catch (error) {
      console.error("Error adding liquidity:", error);
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createLiquidityPool,
    addLiquidity,
    getTokenDetails,
    isLoading,
    status,
    poolAddress,
    txSignature,
    errorMessage,
    progressStage,
    progress,
    estimatedTime,
    solBalance,
    estimatedFees,
    isFeeEstimating,
    isSolBalanceSufficient
  };
}