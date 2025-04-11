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
      <h3 className="status-title">Token created successfully!</h3>
      
      <div className="token-info-grid">
        <div className="token-info-item">
          <span className="info-label">Name</span>
          <span className="info-value">{name}</span>
        </div>
        <div className="token-info-item">
          <span className="info-label">Symbol</span>
          <span className="info-value">{symbol}</span>
        </div>
        <div className="token-info-item">
          <span className="info-label">Total Supply</span>
          <span className="info-value">{totalSupply.toLocaleString()}</span>
        </div>
        <div className="token-info-item">
          <span className="info-label">Address</span>
          <span className="info-value token-address">{tokenAddress}</span>
        </div>
        
        {metadataAddress && (
          <div className="token-info-item">
            <span className="info-label">Metadata Address</span>
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
        <h4>Manage your token</h4>
        
        <div className="action-buttons">
          <button 
            className="action-button revoke-button"
            onClick={() => revokeAuthority('mint')}
          >
            Revoke Mint
          </button>
          
          <button 
            className="action-button revoke-button"
            onClick={() => revokeAuthority('freeze')}
          >
            Revoke Freeze
          </button>
          
          <button 
            className="action-button revoke-button"
            onClick={() => revokeAuthority('update')}
          >
            Revoke Update
          </button>
        </div>
      </div>
      
      <div className="token-links">
        <a 
          href={explorerLink ? explorerLink.replace('/tx/', '/address/') : `https://explorer.solana.com/address/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="status-link"
        >
          View token on Solana Explorer
        </a>
        
        <a 
          href={explorerLink || `https://explorer.solana.com/tx/${txSignature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="status-link"
        >
          View transaction on Solana Explorer
        </a>
        
        {metadataAddress && (
          <a 
            href={`https://explorer.solana.com/address/${metadataAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="status-link"
          >
            View metadata on Solana Explorer
          </a>
        )}
      </div>
      
      <div className="next-steps">
        <h4>Next Steps</h4>
        <div className="next-steps-buttons">
          <Link href={`/create-liquidity?token=${tokenAddress}`} className="next-step-button">
            Create Liquidity Pool
          </Link>
          
          <button 
            onClick={() => window.location.href = "/create-token"} 
            className="next-step-button new-token-button"
          >
            Create a new token
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenCreationSuccess;