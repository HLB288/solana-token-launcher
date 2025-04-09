// components/TokenCreationSuccess.tsx
import React from 'react';
import Link from 'next/link';

interface TokenCreationSuccessProps {
  name: string;
  symbol: string;
  totalSupply: number;
  tokenAddress: string;
  txSignature: string;
  explorerLink: string;
  metadataAddress?: string;
  description?: string;
  revokeAuthority: (authorityType: 'mint' | 'freeze' | 'update') => Promise<void>;
}

const TokenCreationSuccess: React.FC<TokenCreationSuccessProps> = ({
  name,
  symbol,
  totalSupply,
  tokenAddress,
  txSignature,
  explorerLink,
  metadataAddress,
  description,
  revokeAuthority
}) => {
  return (
    <div className="status-container success">
      <h3 className="status-title">Token créé avec succès!</h3>
      
      <div className="token-info-grid">
        <div className="token-info-item">
          <span className="info-label">Nom</span>
          <span className="info-value">{name}</span>
        </div>
        <div className="token-info-item">
          <span className="info-label">Symbole</span>
          <span className="info-value">{symbol}</span>
        </div>
        <div className="token-info-item">
          <span className="info-label">Offre Totale</span>
          <span className="info-value">{totalSupply.toLocaleString()}</span>
        </div>
        <div className="token-info-item">
          <span className="info-label">Adresse</span>
          <span className="info-value token-address">{tokenAddress}</span>
        </div>
        
        {metadataAddress && (
          <div className="token-info-item">
            <span className="info-label">Adresse des métadonnées</span>
            <span className="info-value token-address">{metadataAddress}</span>
          </div>
        )}
        
        {description && (
          <div className="token-info-item full-width">
            <span className="info-label">Description</span>
            <span className="info-value description">{description}</span>
          </div>
        )}
      </div>
      
      <div className="token-actions">
        <h4>Gérer votre token</h4>
        
        <div className="action-buttons">
          <button 
            className="action-button revoke-button"
            onClick={() => revokeAuthority('mint')}
          >
            Révoquer Mint
          </button>
          
          <button 
            className="action-button revoke-button"
            onClick={() => revokeAuthority('freeze')}
          >
            Révoquer Freeze
          </button>
          
          <button 
            className="action-button revoke-button"
            onClick={() => revokeAuthority('update')}
          >
            Révoquer Update
          </button>
        </div>
      </div>
      
      <div className="token-links">
        <a 
          href={explorerLink ? explorerLink.replace('/tx/', '/address/') : `https://explorer.solana.com/address/${tokenAddress}?cluster=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="status-link"
        >
          Voir le token sur Solana Explorer
        </a>
        
        <a 
          href={explorerLink || `https://explorer.solana.com/tx/${txSignature}?cluster=mainnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="status-link"
        >
          Voir la transaction sur Solana Explorer
        </a>
        
        {metadataAddress && (
          <a 
            href={`https://explorer.solana.com/address/${metadataAddress}?cluster=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="status-link"
          >
            Voir les métadonnées sur Solana Explorer
          </a>
        )}
      </div>
      
      <div className="next-steps">
        <h4>Prochaines étapes</h4>
        <Link href="/create-liquidity" className="next-step-button">
          Créer un Pool de Liquidité
        </Link>
      </div>
    </div>
  );
};

export default TokenCreationSuccess;