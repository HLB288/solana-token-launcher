// app/create-liquidity/page.tsx (refactorisé)
'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCreateLiquidity } from '../../hooks/useCreateLiquidity';

export default function CreateLiquidity() {
  const { publicKey } = useWallet();
  
  const [mounted, setMounted] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState(1000);
  const [solAmount, setSolAmount] = useState(1);
  
  // Hook de création de liquidité
  const {
    createLiquidityPool,
    isLoading,
    status,
    poolAddress,
    txSignature,
    errorMessage,
    progressStage,
    progress,
    estimatedTime
  } = useCreateLiquidity({ network: 'mainnet' }); // Changer en 'mainnet' pour la production

  useEffect(() => {
    setMounted(true);
    
    // Ajouter des éléments visuels cosmiques
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
    
    return () => {
      if (starsContainer.parentNode) {
        document.body.removeChild(starsContainer);
      }
    };
  }, []);

  const handleCreatePool = async () => {
    await createLiquidityPool(tokenAddress, tokenAmount, solAmount);
  };

  return (
    <div className="form-container">
      {/* Éléments décoratifs */}
      <div className="planet planet-1" style={{width: '50px', height: '50px', top: '-25px', right: '-25px'}}></div>
      <div className="planet planet-2" style={{width: '40px', height: '40px', bottom: '-20px', left: '-20px'}}></div>
      
      <h2 className="form-title">Créer un Pool de Liquidité</h2>
      
      <div className="form-group">
        <label htmlFor="tokenAddress" className="form-label">Adresse du Token</label>
        <input
          id="tokenAddress"
          type="text"
          className="form-input"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Ex: FTknX..."
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tokenAmount" className="form-label">Montant de Tokens</label>
        <input
          id="tokenAmount"
          type="number"
          className="form-input"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(parseInt(e.target.value))}
          min={1}
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="solAmount" className="form-label">Montant de SOL</label>
        <input
          id="solAmount"
          type="number"
          className="form-input"
          value={solAmount}
          onChange={(e) => setSolAmount(parseFloat(e.target.value))}
          min={0.1}
          step={0.1}
          disabled={isLoading}
        />
      </div>
      
      <button 
        className="form-button"
        onClick={handleCreatePool} 
        disabled={isLoading || !tokenAddress || (mounted && !publicKey)}
      >
        {isLoading ? 'Création en cours...' : 'Créer le Pool de Liquidité'}
      </button>
      
      {mounted && !publicKey && (
        <div className="status-container error">
          <h3 className="status-title">Wallet non connecté</h3>
          <p>Veuillez connecter votre wallet pour créer un pool de liquidité</p>
        </div>
      )}
      
      {status === 'loading' && (
        <div className="status-container loading">
          <h3 className="status-title">Création du pool de liquidité en cours...</h3>
          
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
              <p className="estimated-time">Temps estimé: {estimatedTime - progressStage * 3} secondes</p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'success' && (
        <div className="status-container success">
          <h3 className="status-title">Pool de liquidité créé avec succès!</h3>
          <p>Adresse du Pool: {poolAddress}</p>
          <a 
            href={`https://explorer.solana.com/address/${poolAddress}?cluster=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="status-link"
          >
            Voir le pool sur Solana Explorer
          </a>
          <p>Signature de la transaction: </p>
          <a 
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=mainnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="status-link"
          >
            Voir la transaction sur Solana Explorer
          </a>
        </div>
      )}
      
      {status === 'error' && (
        <div className="status-container error">
          <h3 className="status-title">Erreur lors de la création du pool de liquidité</h3>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}