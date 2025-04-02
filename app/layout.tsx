// app/layout.tsx
'use client';

import './globals.css';
import { SolanaProvider } from '../providers/SolanaProvider';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Import dynamique du bouton de wallet pour éviter les erreurs de SSR
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="fr">
      <head>
        <title>Token Launcher</title>
        <meta name="description" content="Créez vos propres tokens sur la blockchain Solana" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SolanaProvider>
          <div className="app-container">
            <header className="navbar">
              <div className="navbar-container">
                <div className="navbar-logo">Token Launcher</div>
                <nav className="navbar-links">
                  <Link href="/" className="navbar-link">Accueil</Link>
                  <Link href="/create-token" className="navbar-link">Créer un Token</Link>
                  <Link href="/create-liquidity" className="navbar-link">Ajouter Liquidité</Link>
                  <Link href="/how-to-use" className="navbar-link">Guide</Link>
                  <Link href="/faq" className="navbar-link">FAQ</Link>
                </nav>
                <div className="wallet-button-container">
                  {mounted && <WalletMultiButtonDynamic className="wallet-button" />}
                </div>
              </div>
            </header>
            {children}
          </div>
        </SolanaProvider>
      </body>
    </html>
  );
}