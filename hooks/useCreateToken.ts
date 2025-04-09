// 'use client';

// import { useState } from 'react';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';
// import { TokenService, TokenDetails } from '../services/token-service';
// import { TokenUploaderService } from '../services/token-uploader';
// import config from '../config';

// interface CreateTokenOptions {
//   network?: 'mainnet' | 'devnet';
// }

// export function useCreateToken(options: CreateTokenOptions = {}) {
//   const { network = config.network } = options;
  
//   const { connection } = useConnection();
//   const { publicKey, signTransaction } = useWallet();
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
//   const [tokenAddress, setTokenAddress] = useState('');
//   const [txSignature, setTxSignature] = useState('');
//   const [explorerLink, setExplorerLink] = useState('');
//   const [metadataAddress, setMetadataAddress] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [metadataUrl, setMetadataUrl] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [progressStage, setProgressStage] = useState(0);
//   const [currentProgressStep, setCurrentProgressStep] = useState('');

//   // Services
//   const tokenService = new TokenService(network);
//   const tokenUploaderService = new TokenUploaderService(config.pinata.jwt, config.pinata.gateway);

//   // Étapes du processus
//   const progress = [
//     { label: "Initialisation", description: "Préparation de la création du token" },
//     { label: "Upload de l'image", description: "Stockage de l'image sur IPFS" },
//     { label: "Création des métadonnées", description: "Stockage des métadonnées sur IPFS" },
//     { label: "Création du token", description: "Création du token sur la blockchain" },
//     { label: "Initialisation du mint", description: "Configuration des paramètres du token" },
//     { label: "Création du compte", description: "Création du compte pour recevoir les tokens" },
//     { label: "Attribution des tokens", description: "Distribution de l'offre initiale" },
//     { label: "Finalisation", description: "Confirmation et finalisation de la création" }
//   ];

//   /**
//    * Crée un nouveau token avec les détails fournis et l'image
//    */
//   const createToken = async (details: TokenDetails, tokenImage?: File) => {
//     if (!publicKey || !signTransaction) {
//       setStatus('error');
//       setErrorMessage('Veuillez connecter votre wallet');
//       return;
//     }

//     if (!details.name || !details.symbol) {
//       setStatus('error');
//       setErrorMessage('Le nom et le symbole du token sont requis');
//       return;
//     }

//     setIsLoading(true);
//     setStatus('loading');
//     setProgressStage(0);
//     setCurrentProgressStep('Initialisation du processus de création');

//     try {
//       // Créer un objet wallet pour le service
//       const wallet = {
//         publicKey,
//         signTransaction
//       };
      
//       // Mise à jour des métadonnées avec l'adresse du créateur
//       const metadataWithCreator = {
//         ...details,
//         creator: publicKey.toString()
//       };

//       let tokenMetadataUrl = "";
      
//       // Si une image est fournie, uploadons-la sur IPFS
//       if (tokenImage) {
//         setCurrentProgressStep('Upload de l\'image sur IPFS');
//         setProgressStage(1);
        
//         console.log("Tentative d'upload de l'image:", tokenImage.name);
        
//         try {
//           // Upload de l'image et création des métadonnées
//           const { imageUrl: uploadedImageUrl, metadataUrl: uploadedMetadataUrl } = 
//             await tokenUploaderService.uploadTokenAssets(tokenImage, metadataWithCreator);
          
//           console.log('Image uploadée avec succès:', uploadedImageUrl);
//           console.log('Métadonnées uploadées avec succès:', uploadedMetadataUrl);
          
//           setImageUrl(uploadedImageUrl);
//           setMetadataUrl(uploadedMetadataUrl);
//           tokenMetadataUrl = uploadedMetadataUrl;
//         } catch (uploadError) {
//           console.error('Erreur détaillée lors de l\'upload sur IPFS:', uploadError);
//           // Continuer la création du token même si l'upload échoue
//         }
//       } else {
//         setCurrentProgressStep('Préparation des métadonnées sans image');
//         setProgressStage(2);
//       }
      
//       // Ajouter l'URL des métadonnées aux détails du token
//       const tokenDetailsWithMetadata = {
//         ...details,
//         metadataUrl: tokenMetadataUrl
//       };
      
//       // Étape 3-7: Création du token sur Solana
//       setCurrentProgressStep('Création du token sur la blockchain Solana');
//       setProgressStage(3);
      
//       const result = await tokenService.createToken(tokenDetailsWithMetadata, wallet, tokenMetadataUrl);
      
//       // Mettre à jour l'état avec les résultats
//       setTokenAddress(result.tokenAddress);
//       setTxSignature(result.txSignature);
//       setExplorerLink(result.explorerLink);
//       if (result.metadataAddress) {
//         setMetadataAddress(result.metadataAddress);
//       }
      
//       // Finalisation
//       setProgressStage(7);
//       setCurrentProgressStep('Finalisation de la création du token');
      
//       setStatus('success');
//     } catch (error) {
//       console.error("Erreur lors de la création du token:", error);
//       setStatus('error');
//       setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Mint des tokens supplémentaires
//    */
//   const mintTokens = async (recipient: string, amount: number) => {
//     if (!publicKey || !signTransaction || !tokenAddress) {
//       setStatus('error');
//       setErrorMessage('Wallet non connecté ou token inexistant');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Créer un objet wallet pour le service
//       const wallet = {
//         publicKey,
//         signTransaction
//       };
      
//       // Minter des tokens supplémentaires
//       const txSignature = await tokenService.mintTokens(
//         tokenAddress,
//         recipient,
//         amount,
//         wallet
//       );
      
//       // Afficher un message de succès
//       alert(`Tokens mintés avec succès! Transaction: ${txSignature}`);
//     } catch (error) {
//       console.error("Erreur lors du minting de tokens:", error);
//       setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Met à jour les métadonnées du token
//    */
//   const updateMetadata = async (updates: Partial<TokenDetails>, newImage?: File) => {
//     if (!publicKey || !signTransaction || !tokenAddress) {
//       setStatus('error');
//       setErrorMessage('Wallet non connecté ou token inexistant');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Créer un objet wallet pour le service
//       const wallet = {
//         publicKey,
//         signTransaction
//       };
      
//       let updatedMetadataUrl = "";
      
//       // Si une nouvelle image est fournie, uploadons-la
//       if (newImage) {
//         const metadataWithCreator = {
//           ...updates,
//           creator: publicKey.toString()
//         };
        
//         // Upload de la nouvelle image et des métadonnées mises à jour
//         const { metadataUrl } = await tokenUploaderService.uploadTokenAssets(
//           newImage, 
//           metadataWithCreator
//         );
        
//         updatedMetadataUrl = metadataUrl;
//       }
      
//       // Mettre à jour les métadonnées
//       const txSignature = await tokenService.updateTokenMetadata(
//         tokenAddress,
//         updates,
//         wallet,
//         updatedMetadataUrl
//       );
      
//       // Afficher un message de succès
//       alert(`Métadonnées mises à jour avec succès! Transaction: ${txSignature}`);
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour des métadonnées:", error);
//       setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Révoque une autorité du token
//    */
//   const revokeAuthority = async (authorityType: 'mint' | 'freeze' | 'update') => {
//     if (!publicKey || !signTransaction || !tokenAddress) {
//       setStatus('error');
//       setErrorMessage('Wallet non connecté ou token inexistant');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Créer un objet wallet pour le service
//       const wallet = {
//         publicKey,
//         signTransaction
//       };
      
//       // Révoquer l'autorité
//       const txSignature = await tokenService.revokeAuthority(
//         tokenAddress,
//         authorityType,
//         wallet
//       );
      
//       // Afficher un message de succès
//       alert(`Autorité ${authorityType} révoquée avec succès! Transaction: ${txSignature}`);
//     } catch (error) {
//       console.error(`Erreur lors de la révocation de l'autorité ${authorityType}:`, error);
//       setErrorMessage(error instanceof Error ? error.message : "Une erreur s'est produite");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     createToken,
//     mintTokens,
//     updateMetadata,
//     revokeAuthority,
//     isLoading,
//     status,
//     tokenAddress,
//     txSignature,
//     explorerLink,
//     metadataAddress,
//     imageUrl,
//     metadataUrl,
//     errorMessage,
//     progressStage,
//     progress,
//     currentProgressStep
//   };
// }








// hooks/useCreateToken.ts (avec support de métadonnées et gestion mainnet)
'use client';

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, Connection, clusterApiUrl } from '@solana/web3.js';
import { TokenService, TokenDetails } from '../services/token-service';

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
          // Utiliser l'endpoint depuis les variables d'environnement
          const heliusEndpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
          const mainnetConnection = new Connection(heliusEndpoint, 'confirmed');
          
          console.log("Tentative connexion via Helius");
          
          console.log("Tentative connexion directe à mainnet:", heliusEndpoint);
          console.log("Pour l'adresse wallet:", publicKey.toString());
          
          const balance = await mainnetConnection.getBalance(publicKey);
          console.log("Solde brut récupéré:", balance, "lamports");
          console.log("Solde converti:", balance / LAMPORTS_PER_SOL, "SOL");
          
          setSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Erreur critique lors de la récupération du solde SOL:", error);
        }
      };
      
      fetchSolBalance();
    }
  }, [publicKey]);

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
      
      // Finalisation
      setProgressStage(6);
      setStatus('success');
      
      // Mettre à jour le solde après la création
      if (publicKey) {
        // Utiliser la connexion mainnet pour récupérer le solde à jour
        const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await mainnetConnection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
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
      if (publicKey) {
        // Utiliser la connexion mainnet pour récupérer le solde à jour
        const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await mainnetConnection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
      
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
      if (publicKey) {
        // Utiliser la connexion mainnet pour récupérer le solde à jour
        const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await mainnetConnection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
      
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
      if (publicKey) {
        // Utiliser la connexion mainnet pour récupérer le solde à jour
        const mainnetConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
        const balance = await mainnetConnection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      }
      
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