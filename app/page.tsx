// app/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { publicKey } = useWallet();
  
  useEffect(() => {
    // Créer des étoiles scintillantes
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
    
    // Créer des étoiles filantes
    const createShootingStar = () => {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.top = `${Math.random() * 70}%`;
      shootingStar.style.left = `${Math.random() * 70}%`;
      document.body.appendChild(shootingStar);
      
      setTimeout(() => {
        shootingStar.remove();
      }, 2000);
    };
    
    const shootingStarInterval = setInterval(createShootingStar, 5000);
    
    return () => {
      if (starsContainer.parentNode) {
        document.body.removeChild(starsContainer);
      }
      clearInterval(shootingStarInterval);
    };
  }, []);
  
  return (
    <main className="home-container">
      {/* Planètes en décoration */}
      <div className="planet planet-1"></div>
      <div className="planet planet-2"></div>
      <div className="planet planet-3"></div>
      <div className="planet planet-4"></div>
      
      <div className="home-title">
        <span className="title-small">Explorez l'univers des</span>
        <span className="title-main">Tokens Solana</span>
        <span className="title-tagline">Créez, lancez, et voyagez dans l'espace numérique</span>
      </div>
      
      <p className="home-description">
        Bienvenue dans notre cosmos numérique où vous pouvez créer vos propres tokens sur la blockchain Solana.
        Lancez-vous dans l'aventure de la création de tokens aussi facilement que de contempler les étoiles.
      </p>
      
      <Link href="/create-token" className="button-primary">
        <span className="button-text">Créer mon token</span>
        <span className="button-icon">🚀</span>
      </Link>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h3>Création Facile</h3>
          <p>Créez des tokens en quelques clics sans connaissances techniques approfondies</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛠️</div>
          <h3>Personnalisation</h3>
          <p>Définissez le nom, le symbole et l'offre totale selon vos besoins</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Sécurité</h3>
          <p>Vos tokens sont sécurisés par la blockchain Solana</p>
        </div>
      </div>
    </main>
  );
}