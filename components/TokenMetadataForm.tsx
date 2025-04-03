// components/TokenMetadataForm.tsx
import React, { useRef, useState } from 'react';

interface TokenMetadataFormProps {
  name: string;
  setName: (name: string) => void;
  symbol: string;
  setSymbol: (symbol: string) => void;
  description: string;
  setDescription: (description: string) => void;
  decimals: number;
  setDecimals: (decimals: number) => void;
  totalSupply: number;
  setTotalSupply: (totalSupply: number) => void;
  tokenImage: File | null;
  setTokenImage: (image: File | null) => void;
  website: string;
  setWebsite: (website: string) => void;
  twitter: string;
  setTwitter: (twitter: string) => void;
  telegram: string;
  setTelegram: (telegram: string) => void;
  discord: string;
  setDiscord: (discord: string) => void;
  isLoading: boolean;
}

const TokenMetadataForm: React.FC<TokenMetadataFormProps> = ({
  name,
  setName,
  symbol,
  setSymbol,
  description,
  setDescription,
  decimals,
  setDecimals,
  totalSupply,
  setTotalSupply,
  tokenImage,
  setTokenImage,
  website,
  setWebsite,
  twitter,
  setTwitter,
  telegram,
  setTelegram,
  discord,
  setDiscord,
  isLoading
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  return (
    <div className="token-metadata-form">
      <h3 className="form-section-title">Informations de base</h3>
      
      <div className="form-row">
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
      
      <div className="form-row">
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
      
      <h3 className="form-section-title">Liens et Réseaux Sociaux</h3>
      
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
      
      <div className="form-row">
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
      </div>
      
      <div className="metadata-info">
        <h4>À propos des métadonnées</h4>
        <p>
          Les métadonnées enrichissent votre token en ajoutant des informations détaillées qui apparaîtront dans les explorateurs et wallets. Une bonne description et une image reconnaissable rendent votre token plus professionnel et facilement identifiable.
        </p>
      </div>
    </div>
  );
};

export default TokenMetadataForm;