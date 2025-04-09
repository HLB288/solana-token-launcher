// // services/token-uploader.ts

// /**
//  * Service pour uploader des images et des métadonnées pour les tokens
//  * Dans une implémentation réelle, cette classe serait utilisée pour uploader 
//  * les métadonnées sur IPFS, Arweave ou un autre service de stockage décentralisé
//  */
// export class TokenUploaderService {
//     /**
//      * Upload une image de token et retourne l'URL
//      * @param file Le fichier image à uploader
//      * @returns URL de l'image uploadée
//      */
//     async uploadTokenImage(file: File): Promise<string> {
//       try {
//         // Dans une implémentation réelle, vous uploaderiez l'image sur IPFS ou un autre service
//         // Exemple d'implémentation avec un service d'upload de fichiers
        
//         /* Code d'exemple pour uploader sur IPFS via NFT.Storage ou Pinata
//         const formData = new FormData();
//         formData.append('file', file);
        
//         const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${PINATA_JWT_TOKEN}`
//           },
//           body: formData
//         });
        
//         const data = await response.json();
//         return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
//         */
        
//         // Pour cet exemple, nous simulons un upload et retournons une URL factice
//         await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation d'un délai
        
//         return `https://token-launcher-images.example.com/${Date.now()}-${file.name}`;
//       } catch (error) {
//         console.error("Erreur lors de l'upload de l'image:", error);
//         throw error;
//       }
//     }
    
//     /**
//      * Crée et upload les métadonnées du token selon les standards de Solana/Metaplex
//      * @param metadata Les métadonnées du token
//      * @returns URL des métadonnées uploadées
//      */
//     async uploadTokenMetadata(metadata: any): Promise<string> {
//       try {
//         // Formatage des métadonnées selon le standard Metaplex
//         const formattedMetadata = {
//           name: metadata.name,
//           symbol: metadata.symbol,
//           description: metadata.description,
//           image: metadata.image || "https://example.com/default-token-image.png",
//           external_url: metadata.website || "",
//           attributes: [],
//           properties: {
//             files: [
//               {
//                 uri: metadata.image || "https://example.com/default-token-image.png",
//                 type: "image/png"
//               }
//             ],
//             category: "token",
//             creators: [
//               {
//                 address: metadata.creator || "",
//                 share: 100
//               }
//             ]
//           },
//           links: {
//             website: metadata.website || "",
//             twitter: metadata.twitter || "",
//             telegram: metadata.telegram || "",
//             discord: metadata.discord || ""
//           }
//         };
        
//         // Dans une implémentation réelle, vous uploaderiez ce JSON sur IPFS ou Arweave
//         /*
//         const metadataBlob = new Blob([JSON.stringify(formattedMetadata)], { type: 'application/json' });
//         const metadataFile = new File([metadataBlob], 'metadata.json');
        
//         const formData = new FormData();
//         formData.append('file', metadataFile);
        
//         const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${PINATA_JWT_TOKEN}`
//           },
//           body: formData
//         });
        
//         const data = await response.json();
//         return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
//         */
        
//         // Pour cet exemple, nous simulons un upload et retournons une URL factice
//         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation d'un délai
        
//         return `https://token-launcher-metadata.example.com/${Date.now()}.json`;
//       } catch (error) {
//         console.error("Erreur lors de l'upload des métadonnées:", error);
//         throw error;
//       }
//     }
//   }





// services/token-uploader.ts

/**
 * Service pour uploader des images et des métadonnées pour les tokens sur IPFS via Pinata
 */
export class TokenUploaderService {
  private pinataJwt: string;
  private pinataGateway: string;

  /**
   * @param pinataJwt JWT token de Pinata pour l'authentification
   * @param pinataGateway URL de la gateway Pinata (optionnel, par défaut gateway.pinata.cloud)
   */
  constructor(pinataJwt: string, pinataGateway: string = 'gateway.pinata.cloud') {
    this.pinataJwt = pinataJwt;
    this.pinataGateway = pinataGateway;
  }

  /**
   * Upload une image de token sur IPFS via Pinata
   * @param file Le fichier image à uploader
   * @returns URL de l'image uploadée sur IPFS
   */
  async uploadTokenImage(file: File): Promise<string> {
    try {
      console.log("Début de l'upload de l'image token sur IPFS...");
      
      // Créer un FormData pour l'upload du fichier
      const formData = new FormData();
      formData.append('file', file);
      
      // Métadonnées pour Pinata (optionnel mais utile pour l'organisation)
      const metadata = JSON.stringify({
        name: `token-image-${Date.now()}`,
        keyvalues: {
          type: 'token-image',
          timestamp: Date.now().toString()
        }
      });
      formData.append('pinataMetadata', metadata);
      
      // Options de pinning (optionnel)
      const pinataOptions = JSON.stringify({
        cidVersion: 1,
        wrapWithDirectory: false
      });
      formData.append('pinataOptions', pinataOptions);
      
      // Appeler l'API Pinata pour uploader le fichier
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJwt}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Réponse d'erreur Pinata:", errorData);
        throw new Error(`Erreur Pinata: ${errorData.error || JSON.stringify(errorData)}`);
      }
      
      // Récupérer le CID (Content Identifier) du fichier uploadé
      const data = await response.json();
      console.log("Image uploadée avec succès sur IPFS:", data);
      
      // Retourner l'URL de l'image sur IPFS
      return `https://${this.pinataGateway}/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      throw error;
    }
  }
  
  /**
   * Crée et upload les métadonnées du token sur IPFS selon les standards de Solana/Metaplex
   * @param metadata Les métadonnées du token
   * @returns URL des métadonnées uploadées sur IPFS
   */
  async uploadTokenMetadata(metadata: any): Promise<string> {
    try {
      console.log("Début de l'upload des métadonnées token sur IPFS...");
      
      // Formatage des métadonnées selon le standard Metaplex
      const formattedMetadata = {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image: metadata.image || "",
        external_url: metadata.website || "",
        attributes: [],
        properties: {
          files: [
            {
              uri: metadata.image || "",
              type: "image/png" // ou "image/jpeg" selon le type d'image
            }
          ],
          category: "token",
          creators: [
            {
              address: metadata.creator || "",
              share: 100
            }
          ]
        },
        links: {
          website: metadata.website || "",
          twitter: metadata.twitter || "",
          telegram: metadata.telegram || "",
          discord: metadata.discord || ""
        }
      };
      
      // Convertir les métadonnées en JSON
      const metadataStr = JSON.stringify(formattedMetadata);
      
      // Créer un Blob et un File pour l'upload
      const metadataBlob = new Blob([metadataStr], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
      
      // Créer un FormData pour l'upload du fichier
      const formData = new FormData();
      formData.append('file', metadataFile);
      
      // Métadonnées pour Pinata
      const pinataMetadata = JSON.stringify({
        name: `token-metadata-${metadata.symbol.toLowerCase()}-${Date.now()}`,
        keyvalues: {
          type: 'token-metadata',
          symbol: metadata.symbol.toLowerCase(),
          timestamp: Date.now().toString()
        }
      });
      formData.append('pinataMetadata', pinataMetadata);
      
      // Appeler l'API Pinata pour uploader le fichier
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJwt}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Réponse d'erreur Pinata:", errorData);
        throw new Error(`Erreur Pinata: ${errorData.error || JSON.stringify(errorData)}`);
      }
      
      // Récupérer le CID du fichier uploadé
      const data = await response.json();
      console.log("Métadonnées uploadées avec succès sur IPFS:", data);
      
      // Retourner l'URL des métadonnées sur IPFS
      return `https://${this.pinataGateway}/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error("Erreur lors de l'upload des métadonnées:", error);
      throw error;
    }
  }
  
  /**
   * Process complet pour uploader l'image et les métadonnées d'un token
   * @param tokenImage Le fichier image du token
   * @param metadata Les métadonnées du token
   * @returns Les URLs de l'image et des métadonnées
   */
  async uploadTokenAssets(tokenImage: File, metadata: any): Promise<{imageUrl: string, metadataUrl: string}> {
    try {
      // 1. D'abord uploader l'image
      const imageUrl = await this.uploadTokenImage(tokenImage);
      console.log("Image uploadée:", imageUrl);
      
      // 2. Mettre à jour les métadonnées avec l'URL de l'image
      const metadataWithImage = {
        ...metadata,
        image: imageUrl
      };
      
      // 3. Uploader les métadonnées
      const metadataUrl = await this.uploadTokenMetadata(metadataWithImage);
      console.log("Métadonnées uploadées:", metadataUrl);
      
      return {
        imageUrl,
        metadataUrl
      };
    } catch (error) {
      console.error("Erreur lors de l'upload des assets du token:", error);
      throw error;
    }
  }
}