// hooks/useCreateToken.ts (sans génération de keypair)
'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TokenService, TokenDetails } from '../services/token-service';

interface CreateTokenOptions {
  network?: 'mainnet' | 'devnet';
}

export function useCreateToken(options: CreateTokenOptions = {}) {
  const { network = 'devnet' } = options;
  
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tokenAddress, setTokenAddress] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [explorerLink, setExplorerLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progressStage, setProgressStage] = useState(0);

  // Service de création de token
  const tokenService = new TokenService(network);

  // Étapes du processus
  const progress = [
    { label: "Initialisation", description: "Préparation de la création du token" },
    { label: "Création du token", description: "Création du token sur la blockchain" },
    { label: "Initialisation du mint", description: "Configuration des paramètres du token" },
    { label: "Création du compte", description: "Création du compte pour recevoir les tokens" },
    { label: "Attribution des tokens", description: "Distribution de l'offre initiale" },
    { label: "Finalisation", description: "Confirmation et finalisation de la création" }
  ];

  /**
   * Crée un nouveau token avec les détails fournis
   */
  const createToken = async (details: TokenDetails) => {
    if (!publicKey || !signTransaction) {
      setStatus('error');
      setErrorMessage('Veuillez connecter votre wallet');
      return;
    }

    setIsLoading(true);
    setStatus('loading');
    setProgressStage(0);

    try {
      // Étape 1: Initialisation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgressStage(1);

      // Créer un objet wallet pour le service
      const wallet = {
        publicKey,
        signTransaction
      };
      
      // Étape 2: Création du token
      setProgressStage(2);
      
      const result = await tokenService.createToken(details, wallet);
      
      // Mettre à jour l'état avec les résultats
      setTokenAddress(result.tokenAddress);
      setTxSignature(result.txSignature);
      setExplorerLink(result.explorerLink);
      
      // Finalisation
      setProgressStage(5);
      setStatus('success');
    } catch (error) {
      console.error("Erreur lors de la création du token:", error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mint des tokens supplémentaires
   */
  const mintTokens = async (recipient: string, amount: number) => {
    if (!publicKey || !signTransaction || !tokenAddress) {
      setStatus('error');
      setErrorMessage('Wallet non connecté ou token inexistant');
      return;
    }

    setIsLoading(true);

    try {
      // Créer un objet wallet pour le service
      const wallet = {
        publicKey,
        signTransaction
      };
      
      // Minter des tokens supplémentaires
      const txSignature = await tokenService.mintTokens(
        tokenAddress,
        recipient,
        amount,
        wallet
      );
      
      // Afficher un message de succès
      alert(`Tokens mintés avec succès! Transaction: ${txSignature}`);
    } catch (error) {
      console.error("Erreur lors du minting de tokens:", error);
      setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createToken,
    mintTokens,
    isLoading,
    status,
    tokenAddress,
    txSignature,
    explorerLink,
    errorMessage,
    progressStage,
    progress
  };
}