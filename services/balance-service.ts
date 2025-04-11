// services/balance-service.ts
import { PublicKey, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';

/**
 * Service pour obtenir le solde du wallet avec un mécanisme de fallback
 */
export class BalanceService {
  /**
   * Récupère le solde d'un portefeuille en utilisant plusieurs endpoints
   * @param publicKey Clé publique du wallet
   * @returns Solde en SOL
   */
  static async getBalance(publicKey: PublicKey): Promise<number> {
    // Reprendre la logique exacte de DebugConnection.tsx
    // Liste des fallback endpoints
    const endpoints = [
      process.env.NEXT_PUBLIC_HELIUS_RPC_URL, // Essayer d'abord Helius
      'https://api.mainnet-beta.solana.com',
      'https://solana-mainnet.g.alchemy.com/v2/demo',
      'https://solana-api.projectserum.com'
    ].filter(Boolean) as string[];
    
    // Essayer chaque endpoint jusqu'à ce qu'un fonctionne
    for (const endpoint of endpoints) {
      try {
        console.log(`Tentative de récupération du solde via: ${endpoint}`);
        const conn = new Connection(endpoint, 'confirmed');
        const balance = await conn.getBalance(publicKey);
        console.log(`Solde récupéré: ${balance / LAMPORTS_PER_SOL} SOL depuis ${endpoint}`);
        return balance / LAMPORTS_PER_SOL;
      } catch (endpointError) {
        console.error(`Erreur avec l'endpoint ${endpoint}:`, endpointError);
        // Continuer avec l'endpoint suivant
      }
    }
    
    // Si nous arrivons ici, tous les endpoints ont échoué
    console.error('Tous les endpoints ont échoué pour récupérer le solde');
    throw new Error('Impossible de récupérer le solde du wallet');
  }
  
  /**
   * Génère un lien vers l'explorateur Solana
   * @param signature Signature de la transaction
   * @returns URL de l'explorateur
   */
  static getExplorerLink(signature: string): string {
    return `https://explorer.solana.com/tx/${signature}`;
  }
}