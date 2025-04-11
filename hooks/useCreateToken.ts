'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Connection, clusterApiUrl } from '@solana/web3.js';
import { TokenService, TokenDetails } from '../services/token-service';

// Importation du service de balance (à créer)
import { BalanceService } from '../services/balance-service';

interface CreateTokenOptions {
  network?: 'mainnet';
}

export function useCreateToken(options: CreateTokenOptions = {}) {
  const { network = 'mainnet' } = options;
  const MAINNET_ENDPOINT = 'https://api.mainnet-beta.solana.com';

  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tokenAddress, setTokenAddress] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [explorerLink, setExplorerLink] = useState('');
  const [metadataAddress, setMetadataAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [progressStage, setProgressStage] = useState(0);
  const [estimatedFees, setEstimatedFees] = useState<number>(0);
  const [isFeeEstimating, setIsFeeEstimating] = useState<boolean>(false);
  const [solBalance, setSolBalance] = useState<number>(0);

  // Service de création de token
  const tokenService = new TokenService(network);

  // Étapes du processus
  const progress = [
    { label: "Initialisation", description: "Préparation de la création du token" },
    { label: "Création du token", description: "Création du token sur la blockchain" },
    { label: "Initialisation du mint", description: "Configuration des paramètres du token" },
    { label: "Création du compte", description: "Création du compte pour recevoir les tokens" },
    { label: "Attribution des tokens", description: "Distribution de l'offre initiale" },
    { label: "Création des métadonnées", description: "Définition des métadonnées du token" },
    { label: "Finalisation", description: "Confirmation et finalisation de la création" }
  ];

  // Récupérer le solde de SOL de l'utilisateur et estimer les frais au chargement
  useEffect(() => {
    if (publicKey) {
      const fetchSolBalance = async () => {
        try {
          const balance = await BalanceService.getBalance(publicKey);
          setSolBalance(balance);
        } catch (error) {
          console.error("Erreur lors de la récupération du solde SOL:", error);
        }
      };
      
      fetchSolBalance();
      estimateTokenCreationFees();
    }
  }, [publicKey]);
  
  // SUPPRIMER CE BLOC DE CODE QUI CAUSE L'ERREUR
  // Ce bloc était en dehors de toute fonction
  // if (publicKey) {
  //   try {
  //     const updatedBalance = await BalanceService.getBalance(publicKey);
  //     setSolBalance(updatedBalance);
  //   } catch (error) {
  //     console.error("Erreur lors de la mise à jour du solde:", error);
  //   }
  // }

  /**
   * Estime les frais de création d'un token
   */
  const estimateTokenCreationFees = async () => {
    if (!publicKey) return;
    
    setIsFeeEstimating(true);
    try {
      // Appeler le service pour estimer les frais
      const fees = await tokenService.estimateTokenCreationFees();
      setEstimatedFees(fees / LAMPORTS_PER_SOL); // Convertir les lamports en SOL
    } catch (error) {
      console.error("Erreur lors de l'estimation des frais:", error);
      // Valeur par défaut plus élevée pour le mainnet
      setEstimatedFees(network === 'mainnet' ? 0.005 : 0.001);
    } finally {
      setIsFeeEstimating(false);
    }
  };

  /**
   * Vérifie si le solde est suffisant pour couvrir les frais
   */
  const isSolBalanceSufficient = (): boolean => {
    return solBalance >= estimatedFees;
  };

  /**
   * Fonction pour mettre à jour le solde
   */
  const updateBalance = async () => {
    if (publicKey) {
      try {
        const balance = await BalanceService.getBalance(publicKey);
        setSolBalance(balance);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du solde:", error);
      }
    }
  };

  /**
   * Crée un nouveau token avec les détails fournis
   */
  const createToken = async (details: TokenDetails, tokenImage?: File) => {
    if (!publicKey || !signTransaction) {
      setStatus('error');
      setErrorMessage('Veuillez connecter votre wallet');
      return;
    }

    // Vérifier le solde avant de commencer
    if (!isSolBalanceSufficient()) {
      setStatus('error');
      setErrorMessage(`Solde SOL insuffisant. Minimum nécessaire: ${estimatedFees.toFixed(6)} SOL`);
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
      
      // Étapes 2-5: Création du token
      setProgressStage(2);
      
      // Si nous avons une image, nous pourrions l'uploader ici
      // const imageUrl = tokenImage ? await uploadImageToIPFS(tokenImage) : "";
      // details.image = imageUrl;
      
      const result = await tokenService.createToken(details, wallet);
      
      // Mettre à jour l'état avec les résultats
      setTokenAddress(result.tokenAddress);
      setTxSignature(result.txSignature);
      setExplorerLink(result.explorerLink);
      if (result.metadataAddress) {
        setMetadataAddress(result.metadataAddress);
      }
      
      // Étape 6: Métadonnées
      setProgressStage(5);
      
      // Mettre à jour le solde après la création (maintenant à l'intérieur de la fonction async)
      await updateBalance();
      
      // Finalisation
      setProgressStage(6);
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
      
      // Mettre à jour le solde après la transaction
      await updateBalance();
      
      // Afficher un message de succès
      alert(`Tokens mintés avec succès! Transaction: ${txSignature}`);
    } catch (error) {
      console.error("Erreur lors du minting de tokens:", error);
      setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Met à jour les métadonnées du token
   */
  const updateMetadata = async (updates: Partial<TokenDetails>) => {
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
      
      // Mettre à jour les métadonnées
      const txSignature = await tokenService.updateTokenMetadata(
        tokenAddress,
        updates,
        wallet
      );
      
      // Mettre à jour le solde après la transaction
      await updateBalance();
      
      // Afficher un message de succès
      alert(`Métadonnées mises à jour avec succès! Transaction: ${txSignature}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des métadonnées:", error);
      setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Révoque une autorité du token
   */
  const revokeAuthority = async (authorityType: 'mint' | 'freeze' | 'update') => {
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
      
      // Révoquer l'autorité
      const txSignature = await tokenService.revokeAuthority(
        tokenAddress,
        authorityType,
        wallet
      );
      
      // Mettre à jour le solde après la transaction
      await updateBalance();
      
      // Afficher un message de succès
      alert(`Autorité ${authorityType} révoquée avec succès! Transaction: ${txSignature}`);
    } catch (error) {
      console.error(`Erreur lors de la révocation de l'autorité ${authorityType}:`, error);
      setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createToken,
    mintTokens,
    updateMetadata,
    revokeAuthority,
    isLoading,
    status,
    tokenAddress,
    txSignature,
    explorerLink,
    metadataAddress,
    errorMessage,
    progressStage,
    progress,
    estimatedFees,
    isFeeEstimating,
    solBalance,
    isSolBalanceSufficient
  };
}