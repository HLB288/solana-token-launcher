// config/index.ts

// Configuration de l'application
const config = {
    // Réseau Solana (mainnet ou devnet)
    network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'mainnet' | 'devnet',
    
    // Configuration Pinata pour IPFS
    pinata: {
      apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
      apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET || '',
      jwt: process.env.NEXT_PUBLIC_PINATA_JWT || '',
      gateway: 'gateway.pinata.cloud'
    },
    
    // URLs des API Solana
    solanaEndpoints: {
      mainnet: 'https://api.mainnet-beta.solana.com',
      devnet: 'https://api.devnet.solana.com'
    },
    
    // Configuration des métadonnées de token
    token: {
      defaultDecimals: 9,
      defaultIcon: '/default-token-icon.png' // Image par défaut si aucune n'est fournie
    },
    
    // Configuration de l'application
    app: {
      name: 'Token Launcher',
      description: 'Créez facilement des tokens sur la blockchain Solana',
      url: 'https://token-launcher.io'
    },
    
    // Explorateurs blockchain
    explorers: {
      solana: {
        mainnet: 'https://explorer.solana.com',
        devnet: 'https://explorer.solana.com'
      }
    }
  };
  
  export default config;