// // app/create-token/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { LAMPORTS_PER_SOL } from '@solana/web3.js'; 
// import Link from 'next/link';
// import { useCreateToken } from '../../hooks/useCreateToken';

// export default function CreateToken() {
//   const { publicKey } = useWallet();
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const [mounted, setMounted] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 3;
//   const [showForm, setShowForm] = useState(true); // État pour contrôler la visibilité du formulaire
  
//   // Token Info
//   const [name, setName] = useState('');
//   const [symbol, setSymbol] = useState('');
//   const [description, setDescription] = useState('');
//   const [decimals, setDecimals] = useState(9);
//   const [totalSupply, setTotalSupply] = useState(1000000);
//   const [tokenImage, setTokenImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
  
//   // Authorities and permissions
//   const [mintAuthority, setMintAuthority] = useState('');
//   const [freezeAuthority, setFreezeAuthority] = useState('');
//   const [canMint, setCanMint] = useState(true);
//   const [canFreeze, setCanFreeze] = useState(true);
//   const [canUpdate, setCanUpdate] = useState(true);
  
//   // Social links
//   const [website, setWebsite] = useState('');
//   const [twitter, setTwitter] = useState('');
//   const [telegram, setTelegram] = useState('');
//   const [discord, setDiscord] = useState('');
  
//   // Hook de création de token
//   const {
//     createToken,
//     revokeAuthority,
//     isLoading,
//     status,
//     tokenAddress,
//     txSignature,
//     explorerLink,
//     metadataAddress,
//     errorMessage,
//     progressStage,
//     progress,
//     // Ajoutez ces nouvelles propriétés extraites du hook
//     estimatedFees,
//     isFeeEstimating,
//     solBalance,
//     isSolBalanceSufficient
//   } = useCreateToken({ network: 'mainnet' }); // Changer en 'mainnet' pour la production

//   useEffect(() => {
//     setMounted(true);
    
//     // Ajouter les effets visuels
//     const starsContainer = document.createElement('div');
//     starsContainer.className = 'stars';
//     document.body.appendChild(starsContainer);
    
//     for (let i = 0; i < 200; i++) {
//       const star = document.createElement('div');
//       star.className = 'star';
//       star.style.left = `${Math.random() * 100}%`;
//       star.style.top = `${Math.random() * 100}%`;
//       star.style.animationDelay = `${Math.random() * 3}s`;
//       starsContainer.appendChild(star);
//     }
    
//     // Préremplir l'autorité du mint et du freeze avec l'adresse du wallet connecté
//     if (publicKey) {
//       setMintAuthority(publicKey.toString());
//       setFreezeAuthority(publicKey.toString());
//     }
    
//     return () => {
//       if (starsContainer.parentNode) {
//         document.body.removeChild(starsContainer);
//       }
//     };
//   }, [publicKey]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setTokenImage(file);
      
//       // Créer une prévisualisation
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const nextStep = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleCreateToken = async () => {
//     // Préparer les détails du token
//     const tokenDetails = {
//       name,
//       symbol,
//       description,
//       decimals,
//       totalSupply,
//       website,
//       twitter,
//       telegram,
//       discord
//     };

//     // Appeler le hook pour créer le token
//     await createToken(tokenDetails, tokenImage || undefined);
//   };

//   const handleRevokeAuthority = async (authorityType: 'mint' | 'freeze' | 'update') => {
//     await revokeAuthority(authorityType);
    
//     // Mettre à jour l'état local après révocation
//     if (authorityType === 'mint') {
//       setCanMint(false);
//     } else if (authorityType === 'freeze') {
//       setCanFreeze(false);
//     } else if (authorityType === 'update') {
//       setCanUpdate(false);
//     }
//   };

//   // Fonction pour réinitialiser le formulaire
//   const resetForm = () => {
//     // Cacher temporairement le formulaire pour reset l'état
//     setShowForm(false);
    
//     // Réinitialiser tous les états du formulaire
//     setName('');
//     setSymbol('');
//     setDescription('');
//     setDecimals(9);
//     setTotalSupply(1000000);
//     setTokenImage(null);
//     setImagePreview(null);
    
//     // Réinitialiser les autorités mais conserver le wallet actuel
//     if (publicKey) {
//       setMintAuthority(publicKey.toString());
//       setFreezeAuthority(publicKey.toString());
//     } else {
//       setMintAuthority('');
//       setFreezeAuthority('');
//     }
//     setCanMint(true);
//     setCanFreeze(true);
//     setCanUpdate(true);
    
//     // Réinitialiser les informations sociales
//     setWebsite('');
//     setTwitter('');
//     setTelegram('');
//     setDiscord('');
    
//     // Réinitialiser l'étape actuelle
//     setCurrentStep(1);
    
//     // Petit délai pour assurer que tout est réinitialisé avant de réafficher
//     setTimeout(() => {
//       setShowForm(true);
//       // Forcer un rafraîchissement de la page pour réinitialiser également les états du hook
//       window.location.href = "/create-token";
//     }, 100);
//   };

//   // Calculer le temps estimé restant
//   const estimatedTime = 20 - progressStage * 3;

//   // Rendu conditionnel basé sur l'étape actuelle
//   const renderStepContent = () => {
//     switch(currentStep) {
//       case 1:
//         return (
//           <>
//             <h3 className="step-title">Étape 1: Informations de base</h3>
            
//             <div className="form-group">
//               <label htmlFor="name" className="form-label">Nom du Token</label>
//               <input
//                 id="name"
//                 type="text"
//                 className="form-input"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Ex: Cosmic Token"
//                 disabled={isLoading}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="symbol" className="form-label">Symbole</label>
//               <input
//                 id="symbol"
//                 type="text"
//                 className="form-input"
//                 value={symbol}
//                 onChange={(e) => setSymbol(e.target.value)}
//                 placeholder="Ex: CSMC"
//                 maxLength={10}
//                 disabled={isLoading}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="description" className="form-label">Description</label>
//               <textarea
//                 id="description"
//                 className="form-input form-textarea"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Décrivez l'utilité et les caractéristiques de votre token..."
//                 disabled={isLoading}
//                 rows={4}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="decimals" className="form-label">Décimales</label>
//               <input
//                 id="decimals"
//                 type="number"
//                 className="form-input"
//                 value={decimals}
//                 onChange={(e) => setDecimals(parseInt(e.target.value))}
//                 min={0}
//                 max={9}
//                 disabled={isLoading}
//               />
//               <div className="form-help">Les tokens Solana ont généralement 9 décimales.</div>
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="totalSupply" className="form-label">Offre Totale</label>
//               <input
//                 id="totalSupply"
//                 type="number"
//                 className="form-input"
//                 value={totalSupply}
//                 onChange={(e) => setTotalSupply(parseInt(e.target.value))}
//                 min={1}
//                 disabled={isLoading}
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="tokenImage" className="form-label">Image du Token</label>
//               <div className="image-upload-container">
//                 <div 
//                   className={`image-preview ${imagePreview ? 'has-image' : ''}`}
//                   onClick={triggerFileInput}
//                 >
//                   {imagePreview ? (
//                     <img src={imagePreview} alt="Token preview" />
//                   ) : (
//                     <div className="upload-placeholder">
//                       <span className="upload-icon">📷</span>
//                       <span>Cliquez pour ajouter une image</span>
//                     </div>
//                   )}
//                 </div>
//                 <input
//                   ref={fileInputRef}
//                   id="tokenImage"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden-file-input"
//                   disabled={isLoading}
//                 />
//               </div>
//               <div className="form-help">Format recommandé: PNG ou JPG, 512x512px</div>
//             </div>
//           </>
//         );
      
//       case 2:
//         return (
//           <>
//             <h3 className="step-title">Étape 2: Autorisations</h3>
            
//             <div className="form-group">
//               <label className="form-label">Autorité de Mint</label>
//               <div className="toggle-container">
//                 <label className="toggle">
//                   <input
//                     type="checkbox"
//                     checked={canMint}
//                     onChange={(e) => setCanMint(e.target.checked)}
//                     disabled={isLoading}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//                 <span className="toggle-label">Autoriser la création de nouveaux tokens</span>
//               </div>
//             </div>
            
//             {canMint && (
//               <div className="form-group">
//                 <label htmlFor="mintAuthority" className="form-label">Adresse de l'Autorité de Mint</label>
//                 <input
//                   id="mintAuthority"
//                   type="text"
//                   className="form-input"
//                   value={mintAuthority}
//                   onChange={(e) => setMintAuthority(e.target.value)}
//                   placeholder="Adresse Solana (laissez vide pour utiliser votre wallet)"
//                   disabled={isLoading}
//                 />
//                 <div className="form-help">Laissez vide pour utiliser l'adresse de votre wallet</div>
//               </div>
//             )}
            
//             <div className="form-group">
//               <label className="form-label">Autorité de Freeze</label>
//               <div className="toggle-container">
//                 <label className="toggle">
//                   <input
//                     type="checkbox"
//                     checked={canFreeze}
//                     onChange={(e) => setCanFreeze(e.target.checked)}
//                     disabled={isLoading}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//                 <span className="toggle-label">Autoriser le gel de comptes</span>
//               </div>
//             </div>
            
//             {canFreeze && (
//               <div className="form-group">
//                 <label htmlFor="freezeAuthority" className="form-label">Adresse de l'Autorité de Freeze</label>
//                 <input
//                   id="freezeAuthority"
//                   type="text"
//                   className="form-input"
//                   value={freezeAuthority}
//                   onChange={(e) => setFreezeAuthority(e.target.value)}
//                   placeholder="Adresse Solana (laissez vide pour utiliser votre wallet)"
//                   disabled={isLoading}
//                 />
//                 <div className="form-help">Laissez vide pour utiliser l'adresse de votre wallet</div>
//               </div>
//             )}
            
//             <div className="form-group">
//               <label className="form-label">Autorité de Mise à Jour</label>
//               <div className="toggle-container">
//                 <label className="toggle">
//                   <input
//                     type="checkbox"
//                     checked={canUpdate}
//                     onChange={(e) => setCanUpdate(e.target.checked)}
//                     disabled={isLoading}
//                   />
//                   <span className="toggle-slider"></span>
//                 </label>
//                 <span className="toggle-label">Autoriser la mise à jour des métadonnées</span>
//               </div>
//             </div>
            
//             <div className="authority-info">
//               <h4>À propos des Autorisations</h4>
//               <p>
//                 Les autorisations vous permettent de contrôler votre token après sa création. Vous pouvez toujours les révoquer plus tard pour rendre votre token plus décentralisé.
//               </p>
//               <ul className="authority-list">
//                 <li><strong>Mint</strong>: Permet de créer de nouveaux tokens</li>
//                 <li><strong>Freeze</strong>: Permet de geler des comptes de token</li>
//                 <li><strong>Update</strong>: Permet de mettre à jour les métadonnées du token</li>
//               </ul>
//             </div>
//           </>
//         );
      
//       case 3:
//         return (
//           <>
//             <h3 className="step-title">Étape 3: Informations Sociales</h3>
            
//             <div className="form-group">
//               <label htmlFor="website" className="form-label">Site Web</label>
//               <div className="input-with-icon">
//                 <span className="input-icon">🌐</span>
//                 <input
//                   id="website"
//                   type="url"
//                   className="form-input with-icon"
//                   value={website}
//                   onChange={(e) => setWebsite(e.target.value)}
//                   placeholder="https://votresite.com"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="twitter" className="form-label">Twitter</label>
//               <div className="input-with-icon">
//                 <span className="input-icon">🐦</span>
//                 <input
//                   id="twitter"
//                   type="text"
//                   className="form-input with-icon"
//                   value={twitter}
//                   onChange={(e) => setTwitter(e.target.value)}
//                   placeholder="@votrecompte"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="telegram" className="form-label">Telegram</label>
//               <div className="input-with-icon">
//                 <span className="input-icon">📱</span>
//                 <input
//                   id="telegram"
//                   type="text"
//                   className="form-input with-icon"
//                   value={telegram}
//                   onChange={(e) => setTelegram(e.target.value)}
//                   placeholder="t.me/votregroupe"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="discord" className="form-label">Discord</label>
//               <div className="input-with-icon">
//                 <span className="input-icon">💬</span>
//                 <input
//                   id="discord"
//                   type="text"
//                   className="form-input with-icon"
//                   value={discord}
//                   onChange={(e) => setDiscord(e.target.value)}
//                   placeholder="discord.gg/votreserveur"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>
            
//             <div className="form-summary">
//               <h4>Résumé du Token</h4>
//               <div className="summary-grid">
//                 <div className="summary-item">
//                   <span className="summary-label">Nom</span>
//                   <span className="summary-value">{name || 'Non défini'}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Symbole</span>
//                   <span className="summary-value">{symbol || 'Non défini'}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Décimales</span>
//                   <span className="summary-value">{decimals}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Offre Totale</span>
//                   <span className="summary-value">{totalSupply.toLocaleString()}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Mint</span>
//                   <span className="summary-value">{canMint ? 'Activé' : 'Désactivé'}</span>
//                 </div>
//                 <div className="summary-item">
//                   <span className="summary-label">Freeze</span>
//                   <span className="summary-value">{canFreeze ? 'Activé' : 'Désactivé'}</span>
//                 </div>
//               </div>
//             </div>
//           </>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       {showForm && (
//         <div className="form-container token-form">
//           {/* Éléments décoratifs */}
//           <div className="planet planet-1" style={{width: '50px', height: '50px', top: '-25px', right: '-25px'}}></div>
//           <div className="planet planet-2" style={{width: '40px', height: '40px', bottom: '-20px', left: '-20px'}}></div>
          
//           <h2 className="form-title">Créer un nouveau Token</h2>
          
//           {/* Stepper */}
//           <div className="form-stepper">
//             {Array.from({ length: totalSteps }).map((_, index) => (
//               <div
//                 key={index}
//                 className={`stepper-step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
//               >
//                 <div className="step-circle">{index + 1}</div>
//                 <div className="step-name">
//                   {index === 0 ? 'Informations' : index === 1 ? 'Autorisations' : 'Social'}
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* Contenu de l'étape actuelle */}
//           <div className="step-content">
//             {renderStepContent()}
//           </div>
          
//           {/* Navigation des étapes */}
//           <div className="step-navigation">
//             {currentStep > 1 && (
//               <button
//                 type="button"
//                 className="step-button prev"
//                 onClick={prevStep}
//                 disabled={isLoading}
//               >
//                 Précédent
//               </button>
//             )}
            
//             {currentStep < totalSteps ? (
//               <button
//                 type="button"
//                 className="step-button next"
//                 onClick={nextStep}
//                 disabled={isLoading || (currentStep === 1 && (!name || !symbol))}
//               >
//                 Suivant
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 className="step-button create"
//                 onClick={handleCreateToken}
//                 disabled={isLoading || !name || !symbol || (mounted && !publicKey)}
//               >
//                 {isLoading ? 'Création en cours...' : 'Créer le Token'}
//               </button>
//             )}
//           </div>
          
//           {mounted && !publicKey && (
//             <div className="status-container error">
//               <h3 className="status-title">Wallet non connecté</h3>
//               <p>Veuillez connecter votre wallet pour créer un token</p>
//             </div>
//           )}
          
//           {status === 'loading' && (
//             <div className="status-container loading">
//               <h3 className="status-title">Création du token en cours...</h3>
              
//               <div className="progress-container">
//                 <div className="progress-bar">
//                   <div 
//                     className="progress-fill" 
//                     style={{ width: `${(progressStage / (progress.length - 1)) * 100}%` }}
//                   ></div>
//                 </div>
                
//                 <div className="progress-stages">
//                   {progress.map((stage, index) => (
//                     <div 
//                       key={index} 
//                       className={`progress-stage ${index <= progressStage ? 'active' : ''}`}
//                     >
//                       <div className="stage-indicator">{index + 1}</div>
//                       <div className="stage-label">{stage.label}</div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="current-stage-details">
//                   <p className="stage-title">{progress[progressStage].label}</p>
//                   <p className="stage-description">{progress[progressStage].description}</p>
//                   <p className="estimated-time">Temps estimé: {estimatedTime} secondes</p>
//                   <p className="current-step">{currentProgressStep}</p>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {status === 'success' && (
//             <div className="status-container success">
//               <h3 className="status-title">Token créé avec succès!</h3>
              
//               <div className="token-info-grid">
//               <div className="token-info-item">
//                 <span className="info-label">Nom</span>
//                 <span className="info-value">{name}</span>
//               </div>
//               <div className="token-info-item">
//                   <span className="info-label">Symbole</span>
//                   <span className="info-value">{symbol}</span>
//                 </div>
//                 <div className="token-info-item">
//                   <span className="info-label">Offre Totale</span>
//                   <span className="info-value">{totalSupply.toLocaleString()}</span>
//                 </div>
//                 <div className="token-info-item">
//                   <span className="info-label">Adresse</span>
//                   <span className="info-value token-address">{tokenAddress}</span>
//                 </div>
                
//                 {/* Affichage des métadonnées */}
//                 {metadataAddress && (
//                   <div className="token-info-item">
//                     <span className="info-label">Métadonnées</span>
//                     <span className="info-value token-address">{metadataAddress}</span>
//                   </div>
//                 )}
                
//                 {description && (
//                   <div className="token-info-item full-width">
//                     <span className="info-label">Description</span>
//                     <span className="info-value description">{description}</span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="token-actions">
//                 <h4>Gérer votre token</h4>
                
//                 <div className="action-buttons">
//                   {canMint && (
//                     <button 
//                       className="action-button revoke-button"
//                       onClick={() => handleRevokeAuthority('mint')}
//                       disabled={isLoading}
//                     >
//                       Révoquer Mint
//                     </button>
//                   )}
                  
//                   {canFreeze && (
//                     <button 
//                       className="action-button revoke-button"
//                       onClick={() => handleRevokeAuthority('freeze')}
//                       disabled={isLoading}
//                     >
//                       Révoquer Freeze
//                     </button>
//                   )}
                  
//                   {canUpdate && (
//                     <button 
//                       className="action-button revoke-button"
//                       onClick={() => handleRevokeAuthority('update')}
//                       disabled={isLoading}
//                     >
//                       Révoquer Update
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="token-links">
//                 <a 
//                   href={`https://explorer.solana.com/address/${tokenAddress}?cluster=mainnet`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="status-link"
//                 >
//                   Voir le token sur Solana Explorer
//                 </a>
                
//                 <a 
//                   href={`https://explorer.solana.com/tx/${txSignature}?cluster=mainnet`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="status-link"
//                 >
//                   Voir la transaction sur Solana Explorer
//                 </a>
                
//                 {metadataAddress && (
//                   <a 
//                     href={`https://explorer.solana.com/address/${metadataAddress}?cluster=mainnet`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="status-link"
//                   >
//                     Voir les métadonnées sur Solana Explorer
//                   </a>
//                 )}
//               </div>
              
//               <div className="next-steps">
//                 <h4>Prochaines étapes</h4>
//                 <div className="next-steps-buttons">
//                   <Link href="/create-liquidity" className="next-step-button">
//                     Créer un Pool de Liquidité
//                   </Link>
                  
//                   <button 
//                     onClick={resetForm} 
//                     className="next-step-button new-token-button"
//                   >
//                     Créer un nouveau token
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {status === 'error' && (
//             <div className="status-container error">
//               <h3 className="status-title">Erreur lors de la création du token</h3>
//               <p>{errorMessage}</p>
              
//               <button 
//                 onClick={resetForm} 
//                 className="next-step-button new-token-button"
//                 style={{ marginTop: '1rem' }}
//               >
//                 Réessayer
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </>
//   );
// }









































// app/create-token/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js'; 
import Link from 'next/link';
import { useCreateToken } from '../../hooks/useCreateToken';

export default function CreateToken() {
  const { publicKey } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [showForm, setShowForm] = useState(true); // État pour contrôler la visibilité du formulaire
  
  // Token Info
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [totalSupply, setTotalSupply] = useState(1000000);
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Authorities and permissions
  const [mintAuthority, setMintAuthority] = useState('');
  const [freezeAuthority, setFreezeAuthority] = useState('');
  const [canMint, setCanMint] = useState(true);
  const [canFreeze, setCanFreeze] = useState(true);
  const [canUpdate, setCanUpdate] = useState(true);
  
  // Social links
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState('');
  
  // Hook de création de token
  const {
    createToken,
    revokeAuthority,
    isLoading,
    status,
    tokenAddress,
    txSignature,
    explorerLink,
    metadataAddress,
    errorMessage,
    progressStage,
    progress,
    // Propriétés pour le mainnet
    estimatedFees,
    isFeeEstimating,
    solBalance,
    isSolBalanceSufficient
  } = useCreateToken({ network: 'mainnet' }); // Utilise le mainnet

  useEffect(() => {
    setMounted(true);
    
    // Ajouter les effets visuels
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
    
    // Préremplir l'autorité du mint et du freeze avec l'adresse du wallet connecté
    if (publicKey) {
      setMintAuthority(publicKey.toString());
      setFreezeAuthority(publicKey.toString());
    }
    
    return () => {
      if (starsContainer.parentNode) {
        document.body.removeChild(starsContainer);
      }
    };
  }, [publicKey]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTokenImage(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateToken = async () => {
    // Préparer les détails du token
    const tokenDetails = {
      name,
      symbol,
      description,
      decimals,
      totalSupply,
      website,
      twitter,
      telegram,
      discord
    };

    // Appeler le hook pour créer le token
    await createToken(tokenDetails, tokenImage || undefined);
  };

  const handleRevokeAuthority = async (authorityType: 'mint' | 'freeze' | 'update') => {
    await revokeAuthority(authorityType);
    
    // Mettre à jour l'état local après révocation
    if (authorityType === 'mint') {
      setCanMint(false);
    } else if (authorityType === 'freeze') {
      setCanFreeze(false);
    } else if (authorityType === 'update') {
      setCanUpdate(false);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    // Cacher temporairement le formulaire pour reset l'état
    setShowForm(false);
    
    // Réinitialiser tous les états du formulaire
    setName('');
    setSymbol('');
    setDescription('');
    setDecimals(9);
    setTotalSupply(1000000);
    setTokenImage(null);
    setImagePreview(null);
    
    // Réinitialiser les autorités mais conserver le wallet actuel
    if (publicKey) {
      setMintAuthority(publicKey.toString());
      setFreezeAuthority(publicKey.toString());
    } else {
      setMintAuthority('');
      setFreezeAuthority('');
    }
    setCanMint(true);
    setCanFreeze(true);
    setCanUpdate(true);
    
    // Réinitialiser les informations sociales
    setWebsite('');
    setTwitter('');
    setTelegram('');
    setDiscord('');
    
    // Réinitialiser l'étape actuelle
    setCurrentStep(1);
    
    // Petit délai pour assurer que tout est réinitialisé avant de réafficher
    setTimeout(() => {
      setShowForm(true);
      // Forcer un rafraîchissement de la page pour réinitialiser également les états du hook
      window.location.href = "/create-token";
    }, 100);
  };

  // Calculer le temps estimé restant
  const estimatedTime = 20 - progressStage * 3;

  // Rendu conditionnel basé sur l'étape actuelle
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <h3 className="step-title">Étape 1: Informations de base</h3>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nom du Token</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cosmic Token"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="symbol" className="form-label">Symbole</label>
              <input
                id="symbol"
                type="text"
                className="form-input"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Ex: CSMC"
                maxLength={10}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                className="form-input form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez l'utilité et les caractéristiques de votre token..."
                disabled={isLoading}
                rows={4}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="decimals" className="form-label">Décimales</label>
              <input
                id="decimals"
                type="number"
                className="form-input"
                value={decimals}
                onChange={(e) => setDecimals(parseInt(e.target.value))}
                min={0}
                max={9}
                disabled={isLoading}
              />
              <div className="form-help">Les tokens Solana ont généralement 9 décimales.</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="totalSupply" className="form-label">Offre Totale</label>
              <input
                id="totalSupply"
                type="number"
                className="form-input"
                value={totalSupply}
                onChange={(e) => setTotalSupply(parseInt(e.target.value))}
                min={1}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tokenImage" className="form-label">Image du Token</label>
              <div className="image-upload-container">
                <div 
                  className={`image-preview ${imagePreview ? 'has-image' : ''}`}
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Token preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <span>Cliquez pour ajouter une image</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="tokenImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-file-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-help">Format recommandé: PNG ou JPG, 512x512px</div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h3 className="step-title">Étape 2: Autorisations</h3>
            
            <div className="form-group">
              <label className="form-label">Autorité de Mint</label>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={canMint}
                    onChange={(e) => setCanMint(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Autoriser la création de nouveaux tokens</span>
              </div>
            </div>
            
            {canMint && (
              <div className="form-group">
                <label htmlFor="mintAuthority" className="form-label">Adresse de l'Autorité de Mint</label>
                <input
                  id="mintAuthority"
                  type="text"
                  className="form-input"
                  value={mintAuthority}
                  onChange={(e) => setMintAuthority(e.target.value)}
                  placeholder="Adresse Solana (laissez vide pour utiliser votre wallet)"
                  disabled={isLoading}
                />
                <div className="form-help">Laissez vide pour utiliser l'adresse de votre wallet</div>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Autorité de Freeze</label>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={canFreeze}
                    onChange={(e) => setCanFreeze(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Autoriser le gel de comptes</span>
              </div>
            </div>
            
            {canFreeze && (
              <div className="form-group">
                <label htmlFor="freezeAuthority" className="form-label">Adresse de l'Autorité de Freeze</label>
                <input
                  id="freezeAuthority"
                  type="text"
                  className="form-input"
                  value={freezeAuthority}
                  onChange={(e) => setFreezeAuthority(e.target.value)}
                  placeholder="Adresse Solana (laissez vide pour utiliser votre wallet)"
                  disabled={isLoading}
                />
                <div className="form-help">Laissez vide pour utiliser l'adresse de votre wallet</div>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Autorité de Mise à Jour</label>
              <div className="toggle-container">
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={canUpdate}
                    onChange={(e) => setCanUpdate(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">Autoriser la mise à jour des métadonnées</span>
              </div>
            </div>
            
            <div className="authority-info">
              <h4>À propos des Autorisations</h4>
              <p>
                Les autorisations vous permettent de contrôler votre token après sa création. Vous pouvez toujours les révoquer plus tard pour rendre votre token plus décentralisé.
              </p>
              <ul className="authority-list">
                <li><strong>Mint</strong>: Permet de créer de nouveaux tokens</li>
                <li><strong>Freeze</strong>: Permet de geler des comptes de token</li>
                <li><strong>Update</strong>: Permet de mettre à jour les métadonnées du token</li>
              </ul>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h3 className="step-title">Étape 3: Informations Sociales</h3>
            
            <div className="form-group">
              <label htmlFor="website" className="form-label">Site Web</label>
              <div className="input-with-icon">
                <span className="input-icon">🌐</span>
                <input
                  id="website"
                  type="url"
                  className="form-input with-icon"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://votresite.com"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="twitter" className="form-label">Twitter</label>
              <div className="input-with-icon">
                <span className="input-icon">🐦</span>
                <input
                  id="twitter"
                  type="text"
                  className="form-input with-icon"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="@votrecompte"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="telegram" className="form-label">Telegram</label>
              <div className="input-with-icon">
                <span className="input-icon">📱</span>
                <input
                  id="telegram"
                  type="text"
                  className="form-input with-icon"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="t.me/votregroupe"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="discord" className="form-label">Discord</label>
              <div className="input-with-icon">
                <span className="input-icon">💬</span>
                <input
                  id="discord"
                  type="text"
                  className="form-input with-icon"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="discord.gg/votreserveur"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-summary">
              <h4>Résumé du Token</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Nom</span>
                  <span className="summary-value">{name || 'Non défini'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Symbole</span>
                  <span className="summary-value">{symbol || 'Non défini'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Décimales</span>
                  <span className="summary-value">{decimals}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Offre Totale</span>
                  <span className="summary-value">{totalSupply.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Mint</span>
                  <span className="summary-value">{canMint ? 'Activé' : 'Désactivé'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Freeze</span>
                  <span className="summary-value">{canFreeze ? 'Activé' : 'Désactivé'}</span>
                </div>
              </div>
            </div>
            
            {/* Affichage des frais estimés */}
            <div className="fee-estimate">
              <h4>Frais de transaction</h4>
              <p>
                Solde actuel: <strong>{solBalance.toFixed(6)} SOL</strong>
              </p>
              <p>
                Frais estimés: <strong>{isFeeEstimating ? 'Calcul en cours...' : `${estimatedFees.toFixed(6)} SOL`}</strong>
                {!isSolBalanceSufficient() && (
                  <span className="insufficient-balance"> ⚠️ Solde insuffisant</span>
                )}
              </p>
              <p className="fee-warning">
                Les frais sur le mainnet sont réels et non remboursables.
              </p>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {showForm && (
        <div className="form-container token-form">
          {/* Éléments décoratifs */}
          <div className="planet planet-1" style={{width: '50px', height: '50px', top: '-25px', right: '-25px'}}></div>
          <div className="planet planet-2" style={{width: '40px', height: '40px', bottom: '-20px', left: '-20px'}}></div>
          
          <h2 className="form-title">Créer un nouveau Token</h2>
          
          {/* Stepper */}
          <div className="form-stepper">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`stepper-step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              >
                <div className="step-circle">{index + 1}</div>
                <div className="step-name">
                  {index === 0 ? 'Informations' : index === 1 ? 'Autorisations' : 'Social'}
                </div>
              </div>
            ))}
          </div>
          
          {/* Contenu de l'étape actuelle */}
          <div className="step-content">
            {renderStepContent()}
          </div>
          
          {/* Navigation des étapes */}
          <div className="step-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                className="step-button prev"
                onClick={prevStep}
                disabled={isLoading}
              >
                Précédent
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                className="step-button next"
                onClick={nextStep}
                disabled={isLoading || (currentStep === 1 && (!name || !symbol))}
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                className="step-button create"
                onClick={handleCreateToken}
                disabled={
                  isLoading || 
                  !name || 
                  !symbol || 
                  (mounted && !publicKey) || 
                  !isSolBalanceSufficient()
                }
              >
                {isLoading ? 'Création en cours...' : 'Créer le Token'}
              </button>
            )}
          </div>
          
          {mounted && !publicKey && (
            <div className="status-container error">
              <h3 className="status-title">Wallet non connecté</h3>
              <p>Veuillez connecter votre wallet pour créer un token</p>
            </div>
          )}
          
          {mounted && publicKey && currentStep === totalSteps && !isSolBalanceSufficient() && (
            <div className="status-container error">
              <h3 className="status-title">Solde insuffisant</h3>
              <p>Vous avez besoin d'au moins {estimatedFees.toFixed(6)} SOL pour créer un token.</p>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="status-container loading">
              <h3 className="status-title">Création du token en cours...</h3>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(progressStage / (progress.length - 1)) * 100}%` }}
                  ></div>
                </div>
                
                <div className="progress-stages">
                  {progress.map((stage, index) => (
                    <div 
                      key={index} 
                      className={`progress-stage ${index <= progressStage ? 'active' : ''}`}
                    >
                      <div className="stage-indicator">{index + 1}</div>
                      <div className="stage-label">{stage.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="current-stage-details">
                  <p className="stage-title">{progress[progressStage].label}</p>
                  <p className="stage-description">{progress[progressStage].description}</p>
                  <p className="estimated-time">Temps estimé: {estimatedTime} secondes</p>
                </div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
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
                
                {/* Affichage des métadonnées */}
                {metadataAddress && (
                  <div className="token-info-item">
                    <span className="info-label">Métadonnées</span>
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
                  {canMint && (
                    <button 
                      className="action-button revoke-button"
                      onClick={() => handleRevokeAuthority('mint')}
                      disabled={isLoading}
                    >
                      Révoquer Mint
                    </button>
                  )}
                  
                  {canFreeze && (
                    <button 
                      className="action-button revoke-button"
                      onClick={() => handleRevokeAuthority('freeze')}
                      disabled={isLoading}
                    >
                      Révoquer Freeze
                    </button>
                  )}
                  
                  {canUpdate && (
                    <button 
                      className="action-button revoke-button"
                      onClick={() => handleRevokeAuthority('update')}
                      disabled={isLoading}
                    >
                      Révoquer Update
                    </button>
                  )}
                </div>
              </div>
              
              <div className="token-links">
                <a 
                  href={`https://explorer.solana.com/address/${tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="status-link"
                >
                  Voir le token sur Solana Explorer
                </a>
                
                <a 
                  href={`https://explorer.solana.com/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="status-link"
                >
                  Voir la transaction sur Solana Explorer
                </a>
                
                {metadataAddress && (
                  <a 
                    href={`https://explorer.solana.com/address/${metadataAddress}`}
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
                <div className="next-steps-buttons">
                  <Link href="/create-liquidity" className="next-step-button">
                    Créer un Pool de Liquidité
                  </Link>
                  
                  <button 
                    onClick={resetForm} 
                    className="next-step-button new-token-button"
                  >
                    Créer un nouveau token
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="status-container error">
              <h3 className="status-title">Erreur lors de la création du token</h3>
              <p>{errorMessage}</p>
              
              <button 
                onClick={resetForm} 
                className="next-step-button new-token-button"
                style={{ marginTop: '1rem' }}
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}