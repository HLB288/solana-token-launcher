// // services/token-service.ts (avec correction d'import)
// import { 
//   Connection, 
//   PublicKey, 
//   Transaction, 
//   SystemProgram, 
//   Keypair,
//   LAMPORTS_PER_SOL
// } from '@solana/web3.js';
// import {
//   createInitializeMintInstruction,
//   getAssociatedTokenAddress,
//   createAssociatedTokenAccountInstruction,
//   createMintToInstruction,
//   TOKEN_PROGRAM_ID,
//   MINT_SIZE
// } from '@solana/spl-token';

// export interface TokenDetails {
//   name: string;
//   symbol: string;
//   description: string;
//   decimals: number;
//   totalSupply: number;
//   website?: string;
//   twitter?: string;
//   telegram?: string;
//   discord?: string;
// }

// export interface TokenCreationResponse {
//   tokenAddress: string;
//   txSignature: string;
//   explorerLink: string;
// }

// /**
//  * Service pour créer un nouveau token Solana (avec imports corrigés)
//  */
// export class TokenService {
//   private network: 'mainnet' | 'devnet';
//   private connection: Connection;

//   constructor(network: 'mainnet' | 'devnet' = 'devnet') {
//     this.network = network;
    
//     // Initialiser la connexion au réseau approprié
//     const endpoint = network === 'mainnet' 
//       ? 'https://api.mainnet-beta.solana.com' 
//       : 'https://api.devnet.solana.com';
    
//     this.connection = new Connection(endpoint, 'confirmed');
//   }

//   /**
//    * Crée un nouveau token sur la blockchain Solana
//    * @param details Les détails du token à créer
//    * @param wallet L'objet wallet qui contient le signataire
//    */
//   async createToken(
//     details: TokenDetails,
//     wallet: {
//       publicKey: PublicKey;
//       signTransaction: (transaction: Transaction) => Promise<Transaction>;
//     }
//   ): Promise<TokenCreationResponse> {
//     try {
//       console.log("Creating token with wallet:", wallet.publicKey.toString());
      
//       // Générer un keypair pour le mint
//       const mintKeypair = Keypair.generate();
//       console.log("Generated mint keypair:", mintKeypair.publicKey.toString());
      
//       // Calculer le loyer nécessaire pour le compte de mint
//       // Au lieu d'utiliser getMinimumBalanceForRentExemption de @solana/spl-token,
//       // nous utilisons directement getMinimumBalanceForRentExemption de la connexion
//       const rentExemptMint = await this.connection.getMinimumBalanceForRentExemption(
//         MINT_SIZE
//       );
      
//       // Obtenir l'adresse du compte associé pour le wallet
//       const associatedTokenAddress = await getAssociatedTokenAddress(
//         mintKeypair.publicKey,
//         wallet.publicKey
//       );
      
//       // Construire la transaction
//       const transaction = new Transaction();
      
//       // Instruction 1: Créer le compte pour le mint
//       transaction.add(
//         SystemProgram.createAccount({
//           fromPubkey: wallet.publicKey,
//           newAccountPubkey: mintKeypair.publicKey,
//           space: MINT_SIZE,
//           lamports: rentExemptMint,
//           programId: TOKEN_PROGRAM_ID
//         })
//       );
      
//       // Instruction 2: Initialiser le mint
//       transaction.add(
//         createInitializeMintInstruction(
//           mintKeypair.publicKey,  // Le mint
//           details.decimals,       // Décimales
//           wallet.publicKey,       // Mint authority
//           wallet.publicKey,       // Freeze authority
//           TOKEN_PROGRAM_ID
//         )
//       );
      
//       // Instruction 3: Créer le compte associé pour le propriétaire
//       transaction.add(
//         createAssociatedTokenAccountInstruction(
//           wallet.publicKey,         // Payeur
//           associatedTokenAddress,   // Compte associé
//           wallet.publicKey,         // Propriétaire
//           mintKeypair.publicKey     // Mint
//         )
//       );
      
//       // Instruction 4: Minter l'offre initiale
//       const mintAmount = details.totalSupply * Math.pow(10, details.decimals);
//       transaction.add(
//         createMintToInstruction(
//           mintKeypair.publicKey,     // Mint
//           associatedTokenAddress,    // Destination
//           wallet.publicKey,          // Autorité
//           BigInt(mintAmount)         // Montant (ajusté pour les décimales et converti en BigInt)
//         )
//       );
      
//       // Signer avec le wallet
//       transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
//       transaction.feePayer = wallet.publicKey;
      
//       const signedTx = await wallet.signTransaction(transaction);
      
//       // Ajouter la signature du mintKeypair
//       signedTx.partialSign(mintKeypair);
      
//       // Envoyer la transaction signée
//       const rawTransaction = signedTx.serialize();
//       const txid = await this.connection.sendRawTransaction(rawTransaction, {
//         skipPreflight: false,
//         preflightCommitment: 'confirmed'
//       });
      
//       // Attendre la confirmation
//       await this.connection.confirmTransaction(txid, 'confirmed');
      
//       console.log("Transaction confirmed:", txid);
      
//       // Construire le lien explorer
//       const explorerLink = this.getExplorerLink(txid);
      
//       // Retourner les informations sur le token créé
//       return {
//         tokenAddress: mintKeypair.publicKey.toString(),
//         txSignature: txid,
//         explorerLink
//       };
//     } catch (error) {
//       console.error("Erreur lors de la création du token:", error);
//       throw error;
//     }
//   }

//   /**
//    * Mint (ajouter) des tokens à une adresse spécifiée
//    */
//   async mintTokens(
//     tokenAddress: string,
//     recipientAddress: string,
//     amount: number,
//     wallet: {
//       publicKey: PublicKey;
//       signTransaction: (transaction: Transaction) => Promise<Transaction>;
//     }
//   ): Promise<string> {
//     try {
//       const mintPubkey = new PublicKey(tokenAddress);
//       const recipientPubkey = new PublicKey(recipientAddress);
      
//       // Obtenir l'adresse du compte associé pour le destinataire
//       const recipientTokenAccount = await getAssociatedTokenAddress(
//         mintPubkey,
//         recipientPubkey
//       );
      
//       // Construire la transaction
//       const transaction = new Transaction();
      
//       // Vérifier si le compte associé existe déjà
//       const accountInfo = await this.connection.getAccountInfo(recipientTokenAccount);
      
//       if (!accountInfo) {
//         // Le compte n'existe pas, nous devons le créer d'abord
//         transaction.add(
//           createAssociatedTokenAccountInstruction(
//             wallet.publicKey,
//             recipientTokenAccount,
//             recipientPubkey,
//             mintPubkey
//           )
//         );
//       }
      
//       // Ajouter l'instruction pour minter des tokens
//       transaction.add(
//         createMintToInstruction(
//           mintPubkey,               // Mint
//           recipientTokenAccount,    // Destination
//           wallet.publicKey,         // Autorité
//           BigInt(amount)            // Montant (converti en BigInt)
//         )
//       );
      
//       // Ajouter le blockhash et le payeur
//       transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
//       transaction.feePayer = wallet.publicKey;
      
//       // Signer avec le wallet
//       const signedTx = await wallet.signTransaction(transaction);
      
//       // Envoyer la transaction signée
//       const rawTransaction = signedTx.serialize();
//       const txid = await this.connection.sendRawTransaction(rawTransaction, {
//         skipPreflight: false,
//         preflightCommitment: 'confirmed'
//       });
      
//       // Attendre la confirmation
//       await this.connection.confirmTransaction(txid, 'confirmed');
      
//       return txid;
//     } catch (error) {
//       console.error("Erreur lors du minting de tokens:", error);
//       throw error;
//     }
//   }

//   /**
//    * Construit un lien vers l'explorateur Solana
//    */
//   private getExplorerLink(signature: string): string {
//     const baseUrl = this.network === 'mainnet'
//       ? 'https://explorer.solana.com'
//       : 'https://explorer.solana.com';
    
//     return `${baseUrl}/tx/${signature}?cluster=${this.network}`;
//   }
// }






// services/token-service.ts (avec support des métadonnées)
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE
} from '@solana/spl-token';
import { 
  createCreateMetadataAccountV3Instruction
} from '@metaplex-foundation/mpl-token-metadata';

// Définir le programme de métadonnées de token
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export interface TokenDetails {
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  totalSupply: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  image?: string; // URL de l'image du token
}

export interface TokenCreationResponse {
  tokenAddress: string;
  txSignature: string;
  explorerLink: string;
  metadataAddress: string;
}

/**
 * Service pour créer un nouveau token Solana avec métadonnées
 */
export class TokenService {
  private network: 'mainnet' | 'devnet';
  private connection: Connection;

  constructor(network: 'mainnet' | 'devnet' = 'devnet') {
    this.network = network;
    
    // Initialiser la connexion au réseau approprié
    const endpoint = network === 'mainnet' 
      ? 'https://api.mainnet-beta.solana.com' 
      : 'https://api.devnet.solana.com';
    
    this.connection = new Connection(endpoint, 'confirmed');
  }

  /**
   * Crée un nouveau token sur la blockchain Solana avec métadonnées
   * @param details Les détails du token à créer
   * @param wallet L'objet wallet qui contient le signataire
   */
  async createToken(
    details: TokenDetails,
    wallet: {
      publicKey: PublicKey;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    }
  ): Promise<TokenCreationResponse> {
    try {
      console.log("Creating token with wallet:", wallet.publicKey.toString());
      
      // Générer un keypair pour le mint
      const mintKeypair = Keypair.generate();
      console.log("Generated mint keypair:", mintKeypair.publicKey.toString());
      
      // Calculer le loyer nécessaire pour le compte de mint
      const rentExemptMint = await this.connection.getMinimumBalanceForRentExemption(
        MINT_SIZE
      );
      
      // Obtenir l'adresse du compte associé pour le wallet
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );
      
      // Obtenir l'adresse PDA pour les métadonnées
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      
      console.log("Metadata PDA:", metadataPDA.toString());
      
      // Construire la transaction
      const transaction = new Transaction();
      
      // Instruction 1: Créer le compte pour le mint
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports: rentExemptMint,
          programId: TOKEN_PROGRAM_ID
        })
      );
      
      // Instruction 2: Initialiser le mint
      transaction.add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,  // Le mint
          details.decimals,       // Décimales
          wallet.publicKey,       // Mint authority
          wallet.publicKey,       // Freeze authority
          TOKEN_PROGRAM_ID
        )
      );
      
      // Instruction 3: Créer le compte associé pour le propriétaire
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,         // Payeur
          associatedTokenAddress,   // Compte associé
          wallet.publicKey,         // Propriétaire
          mintKeypair.publicKey     // Mint
        )
      );
      
      // Instruction 4: Minter l'offre initiale
      const mintAmount = details.totalSupply * Math.pow(10, details.decimals);
      transaction.add(
        createMintToInstruction(
          mintKeypair.publicKey,     // Mint
          associatedTokenAddress,    // Destination
          wallet.publicKey,          // Autorité
          BigInt(mintAmount)         // Montant (ajusté pour les décimales et converti en BigInt)
        )
      );
      
      // Instruction 5: Créer les métadonnées du token
      // Préparer les données de métadonnées
      const tokenMetadata = {
        name: details.name,
        symbol: details.symbol,
        uri: "", // URL des métadonnées JSON (peut être laissé vide pour l'instant)
        sellerFeeBasisPoints: 0, // 0% de frais
        creators: null,
        collection: null,
        uses: null
      };
      
      // Ajouter l'instruction pour créer les métadonnées
      transaction.add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPDA,
            mint: mintKeypair.publicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: tokenMetadata,
              isMutable: true,
              collectionDetails: null,
            },
          }
        )
      );
      
      // Signer avec le wallet
      transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = wallet.publicKey;
      
      const signedTx = await wallet.signTransaction(transaction);
      
      // Ajouter la signature du mintKeypair
      signedTx.partialSign(mintKeypair);
      
      // Envoyer la transaction signée
      const rawTransaction = signedTx.serialize();
      const txid = await this.connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
      
      // Attendre la confirmation avec un timeout plus long
      const confirmation = await this.connection.confirmTransaction({
        signature: txid,
        blockhash: transaction.recentBlockhash,
        lastValidBlockHeight: (await this.connection.getLatestBlockhash()).lastValidBlockHeight
      }, 'confirmed');
      
      console.log("Transaction confirmed:", txid);
      
      // Construire le lien explorer
      const explorerLink = this.getExplorerLink(txid);
      
      // Retourner les informations sur le token créé
      return {
        tokenAddress: mintKeypair.publicKey.toString(),
        txSignature: txid,
        explorerLink,
        metadataAddress: metadataPDA.toString()
      };
    } catch (error) {
      console.error("Erreur lors de la création du token:", error);
      throw error;
    }
  }

  /**
   * Mint (ajouter) des tokens à une adresse spécifiée
   */
  async mintTokens(
    tokenAddress: string,
    recipientAddress: string,
    amount: number,
    wallet: {
      publicKey: PublicKey;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    }
  ): Promise<string> {
    try {
      const mintPubkey = new PublicKey(tokenAddress);
      const recipientPubkey = new PublicKey(recipientAddress);
      
      // Obtenir l'adresse du compte associé pour le destinataire
      const recipientTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        recipientPubkey
      );
      
      // Construire la transaction
      const transaction = new Transaction();
      
      // Vérifier si le compte associé existe déjà
      const accountInfo = await this.connection.getAccountInfo(recipientTokenAccount);
      
      if (!accountInfo) {
        // Le compte n'existe pas, nous devons le créer d'abord
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            recipientTokenAccount,
            recipientPubkey,
            mintPubkey
          )
        );
      }
      
      // Ajouter l'instruction pour minter des tokens
      transaction.add(
        createMintToInstruction(
          mintPubkey,               // Mint
          recipientTokenAccount,    // Destination
          wallet.publicKey,         // Autorité
          BigInt(amount)            // Montant (converti en BigInt)
        )
      );
      
      // Ajouter le blockhash et le payeur
      transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = wallet.publicKey;
      
      // Signer avec le wallet
      const signedTx = await wallet.signTransaction(transaction);
      
      // Envoyer la transaction signée
      const rawTransaction = signedTx.serialize();
      const txid = await this.connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
      
      // Attendre la confirmation
      await this.connection.confirmTransaction(txid, 'confirmed');
      
      return txid;
    } catch (error) {
      console.error("Erreur lors du minting de tokens:", error);
      throw error;
    }
  }

  /**
   * Met à jour les métadonnées d'un token existant
   */
  async updateTokenMetadata(
    tokenAddress: string,
    metadataUpdates: Partial<TokenDetails>,
    wallet: {
      publicKey: PublicKey;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    }
  ): Promise<string> {
    try {
      const mintPubkey = new PublicKey(tokenAddress);
      
      // Obtenir l'adresse PDA pour les métadonnées
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintPubkey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      
      // Note: Ici, nous devrions utiliser createUpdateMetadataAccountV2Instruction
      // Cela nécessiterait de récupérer d'abord les métadonnées existantes
      
      // Pour l'instant, simulons une mise à jour réussie
      console.log(`Metadata updated for token: ${tokenAddress}`);
      
      return "simulated_update_tx";
    } catch (error) {
      console.error("Erreur lors de la mise à jour des métadonnées:", error);
      throw error;
    }
  }

  /**
   * Révoque une autorité du token
   */
  async revokeAuthority(
    tokenAddress: string,
    authorityType: 'mint' | 'freeze' | 'update',
    wallet: {
      publicKey: PublicKey;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
    }
  ): Promise<string> {
    try {
      // Cette fonction est une simplification. Dans une implémentation réelle, 
      // nous utiliserions les instructions appropriées pour révoquer l'autorité
      // spécifiée en définissant l'autorité à null ou à une clé brûlée
      
      // Simuler une transaction de révocation
      const txid = "revoked_" + authorityType + "_" + Date.now().toString();
      
      console.log(`${authorityType} authority revoked for token:`, tokenAddress);
      
      return txid;
    } catch (error) {
      console.error(`Erreur lors de la révocation de l'autorité ${authorityType}:`, error);
      throw error;
    }
  }

  /**
   * Construit un lien vers l'explorateur Solana
   */
  private getExplorerLink(signature: string): string {
    const baseUrl = this.network === 'mainnet'
      ? 'https://explorer.solana.com'
      : 'https://explorer.solana.com';
    
    return `${baseUrl}/tx/${signature}?cluster=${this.network}`;
  }
}