// services/wallet-adapter.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

/**
 * Adaptateur pour interagir avec le wallet Solana et la bibliothèque Gill
 * Cette classe fait le pont entre le wallet adapter de Solana et notre service de token
 */
export class SolanaWalletAdapter {
  private connection: Connection;
  
  constructor(network: 'mainnet' | 'devnet' = 'devnet') {
    // Initialiser la connexion au réseau Solana approprié
    const endpoint = network === 'mainnet' 
      ? 'https://api.mainnet-beta.solana.com' 
      : 'https://api.devnet.solana.com';
    
    this.connection = new Connection(endpoint, 'confirmed');
  }
  
  /**
   * Crée une fonction pour signer et envoyer une transaction à partir d'un wallet adapter Solana
   * @param publicKey Clé publique du wallet
   * @param sendTransaction Fonction pour envoyer une transaction à partir du wallet adapter
   * @returns Fonction qui signe et envoie une transaction
   */
  createSignAndSendTransactionFunction(
    publicKey: PublicKey,
    sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>
  ) {
    return async (transaction: any): Promise<string> => {
      try {
        // Convertir la transaction Gill en transaction Solana Web3.js
        const solanaTransaction = Transaction.from(transaction.serializedMessage);
        
        // Ajouter la clé publique du signataire
        solanaTransaction.feePayer = publicKey;
        
        // Envoyer la transaction via le wallet adapter et la connexion
        const signature = await sendTransaction(solanaTransaction, this.connection);
        
        // Attendre la confirmation de la transaction
        await this.connection.confirmTransaction(signature, 'confirmed');
        
        return signature;
      } catch (error) {
        console.error("Erreur lors de l'envoi de la transaction:", error);
        throw error;
      }
    };
  }
  
  /**
   * Obtient le solde de SOL d'une adresse
   * @param address Adresse du wallet
   * @returns Solde en SOL
   */
  async getSolBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convertir lamports en SOL
    } catch (error) {
      console.error("Erreur lors de la récupération du solde:", error);
      throw error;
    }
  }
  
  /**
   * Obtient les détails d'un token
   * @param tokenAddress Adresse du token
   * @returns Détails du token
   */
  async getTokenDetails(tokenAddress: string): Promise<any> {
    try {
      // Implémenter la logique pour récupérer les détails du token
      // Cela peut impliquer d'interroger les comptes du programme token et les métadonnées
      
      // Pour cet exemple, nous retournons des données factices
      return {
        name: "Exemple Token",
        symbol: "EXT",
        decimals: 9,
        supply: 1000000,
        // Autres détails...
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du token:", error);
      throw error;
    }
  }
}