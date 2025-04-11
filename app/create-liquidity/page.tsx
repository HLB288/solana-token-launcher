// app/create-liquidity/page.tsx (improved)
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreateLiquidity } from '../../hooks/useCreateLiquidity';
import Link from 'next/link';

export default function CreateLiquidity() {
  const { publicKey } = useWallet();
  
  const [mounted, setMounted] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState(1000);
  const [solAmount, setSolAmount] = useState(1);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenName, setTokenName] = useState('');
  
  // Liquidity creation hook
  const {
    createLiquidityPool,
    isLoading,
    status,
    poolAddress,
    txSignature,
    errorMessage,
    progressStage,
    progress,
    estimatedTime,
    solBalance,
    estimatedFees,
    isFeeEstimating,
    getTokenDetails,
    isSolBalanceSufficient
  } = useCreateLiquidity({ network: 'mainnet' });

  useEffect(() => {
    setMounted(true);
    
    // Add cosmic visual elements
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);
    
    for (let i = 0; i < 200; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
    
    // Check if a tokenAddress is passed in the URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setTokenAddress(tokenParam);
      // Try to get token details
      fetchTokenDetails(tokenParam);
    }
    
    return () => {
      if (starsContainer.parentNode) {
        document.body.removeChild(starsContainer);
      }
    };
  }, []);

  const fetchTokenDetails = async (address: any) => {
    try {
      if (!address) return;
      
      const details = await getTokenDetails(address);
      if (details) {
        setTokenName(details.name || '');
        setTokenSymbol(details.symbol || '');
      }
    } catch (error) {
      console.error("Error fetching token details:", error);
    }
  };

  const handleCreatePool = async () => {
    if (!tokenAddress) {
      alert("Please enter the token address");
      return;
    }
    
    if (tokenAmount <= 0) {
      alert("Token amount must be greater than 0");
      return;
    }
    
    if (solAmount <= 0) {
      alert("SOL amount must be greater than 0");
      return;
    }
    
    if (!isSolBalanceSufficient()) {
      alert(`Insufficient SOL balance. You need at least ${estimatedFees.toFixed(6)} SOL.`);
      return;
    }
    
    await createLiquidityPool(tokenAddress, tokenAmount, solAmount);
  };
  
  const handleTokenAddressChange = async (e: any) => {
    const address = e.target.value;
    setTokenAddress(address);
    
    if (address.length >= 32) {
      await fetchTokenDetails(address);
    } else {
      setTokenName('');
      setTokenSymbol('');
    }
  };

  return (
    <div className="form-container">
      {/* Decorative elements */}
      <div className="planet planet-1" style={{width: '50px', height: '50px', top: '-25px', right: '-25px'}}></div>
      <div className="planet planet-2" style={{width: '40px', height: '40px', bottom: '-20px', left: '-20px'}}></div>
      
      <h2 className="form-title">Create Liquidity Pool</h2>
      
      <p className="form-description">
        A liquidity pool allows users to exchange your token for SOL.
        This increases the visibility and utility of your token.
      </p>
      
      <div className="form-group">
        <label htmlFor="tokenAddress" className="form-label">Token Address</label>
        <input
          id="tokenAddress"
          type="text"
          className="form-input"
          value={tokenAddress}
          onChange={handleTokenAddressChange}
          placeholder="Ex: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          disabled={isLoading}
        />
        {tokenName && tokenSymbol && (
          <div className="token-details-preview">
            Token found: <strong>{tokenName}</strong> ({tokenSymbol})
          </div>
        )}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tokenAmount" className="form-label">Token Amount</label>
          <input
            id="tokenAmount"
            type="number"
            className="form-input"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(parseInt(e.target.value) || 0)}
            min={1}
            disabled={isLoading}
          />
          <div className="form-help">Quantity of tokens to add to the pool</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="solAmount" className="form-label">SOL Amount</label>
          <input
            id="solAmount"
            type="number"
            className="form-input"
            value={solAmount}
            onChange={(e) => setSolAmount(parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            disabled={isLoading}
          />
          <div className="form-help">Quantity of SOL to pair with your tokens</div>
        </div>
      </div>
      
      {/* Display estimated fees */}
      <div className="fee-estimate">
        <h4>Transaction Fees</h4>
        <p>
          Current balance: <strong>{solBalance.toFixed(6)} SOL</strong>
        </p>
        <p>
          Estimated fees: <strong>{isFeeEstimating ? 'Calculating...' : `${estimatedFees.toFixed(6)} SOL`}</strong>
          {!isSolBalanceSufficient() && (
            <span className="insufficient-balance"> ⚠️ Insufficient balance</span>
          )}
        </p>
        <p className="fee-warning">
          Fees on mainnet are real and non-refundable.
        </p>
      </div>
      
      <div className="liquidity-info">
        <h4>Token/SOL ratio: {tokenAmount / solAmount}</h4>
        <p>
          This ratio determines the initial price of your token. 
          A higher ratio means a lower price for your token.
        </p>
      </div>
      
      <button 
        className="form-button"
        onClick={handleCreatePool} 
        disabled={isLoading || !tokenAddress || (mounted && !publicKey) || !isSolBalanceSufficient()}
      >
        {isLoading ? 'Creating...' : 'Create Liquidity Pool'}
      </button>
      
      {mounted && !publicKey && (
        <div className="status-container error">
          <h3 className="status-title">Wallet not connected</h3>
          <p>Please connect your wallet to create a liquidity pool</p>
        </div>
      )}
      
      {status === 'loading' && (
        <div className="status-container loading">
          <h3 className="status-title">Creating liquidity pool...</h3>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(progressStage / (progress.length - 1)) * 100}%` }}></div>
            </div>
            
            <div className="progress-stages">
              {progress.map((stage, index) => (
                <div key={index} className={`progress-stage ${index <= progressStage ? 'active' : ''}`}>
                  <div className="stage-indicator">{index + 1}</div>
                  <div className="stage-label">{stage.label}</div>
                </div>
              ))}
            </div>
            
            <div className="current-stage-details">
              <p className="stage-title">{progress[progressStage].label}</p>
              <p className="stage-description">{progress[progressStage].description}</p>
              <p className="estimated-time">Estimated time: {estimatedTime - progressStage * 3} seconds</p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'success' && (
        <div className="status-container success">
          <h3 className="status-title">Liquidity pool created successfully!</h3>
          <div className="token-info-grid">
            <div className="token-info-item">
              <span className="info-label">Pool Address</span>
              <span className="info-value token-address">{poolAddress}</span>
            </div>
            <div className="token-info-item">
              <span className="info-label">Token</span>
              <span className="info-value">{tokenName || tokenAddress.substring(0, 8) + '...'}</span>
            </div>
            <div className="token-info-item">
              <span className="info-label">Token Liquidity</span>
              <span className="info-value">{tokenAmount.toLocaleString()} {tokenSymbol}</span>
            </div>
            <div className="token-info-item">
              <span className="info-label">SOL Liquidity</span>
              <span className="info-value">{solAmount.toLocaleString()} SOL</span>
            </div>
          </div>
          
          <div className="token-links">
            <a 
              href={`https://explorer.solana.com/address/${poolAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="status-link"
            >
              View pool on Solana Explorer
            </a>
            <a 
              href={`https://explorer.solana.com/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="status-link"
            >
              View transaction on Solana Explorer
            </a>
          </div>
          
          <div className="next-steps">
            <h4>Next Steps</h4>
            <div className="next-steps-buttons">
              <Link href="/" className="next-step-button">
                Back to Home
              </Link>
              <button 
                onClick={() => window.location.reload()} 
                className="next-step-button new-token-button"
              >
                Create Another Pool
              </button>
            </div>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="status-container error">
          <h3 className="status-title">Error creating liquidity pool</h3>
          <p>{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="next-step-button new-token-button"
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}