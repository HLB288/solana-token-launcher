// app/how-to-use/page.tsx
'use client';

export default function HowToUse() {
  return (
    <div className="how-to-use-container">
      <h1 className="how-to-use-title">Comment Utiliser Token Launcher</h1>
      
      <div className="step-container">
        <div className="step-number">1</div>
        <div className="step-content">
          <h2>Connectez votre Wallet</h2>
          <p>
            Avant de commencer, connectez votre wallet Solana en cliquant sur le bouton "Connecter un Wallet" dans la barre de navigation. 
            Assurez-vous d'avoir suffisamment de SOL pour couvrir les frais de transaction.
          </p>
          <div className="step-image-placeholder">
            <span>Image: Connexion du wallet</span>
          </div>
        </div>
      </div>
      
      <div className="step-container">
        <div className="step-number">2</div>
        <div className="step-content">
          <h2>Accédez à la page de création</h2>
          <p>
            Naviguez vers la page "Créer un Token" depuis la barre de navigation.
          </p>
          <div className="step-image-placeholder">
            <span>Image: Navigation vers la page de création</span>
          </div>
        </div>
      </div>
      
      <div className="step-container">
        <div className="step-number">3</div>
        <div className="step-content">
          <h2>Remplissez les informations du token</h2>
          <p>
            Renseignez les informations suivantes :
          </p>
          <ul className="step-list">
            <li><strong>Nom du Token</strong> : Le nom complet de votre token (ex: "Cosmic Token")</li>
            <li><strong>Symbole</strong> : Un code court pour votre token, généralement 3-5 caractères (ex: "CSMC")</li>
            <li><strong>Description</strong> : Une brève description expliquant l'utilité de votre token</li>
            <li><strong>Décimales</strong> : Le nombre de décimales pour votre token (généralement 9 pour Solana)</li>
            <li><strong>Offre Totale</strong> : Le nombre total de tokens à créer</li>
          </ul>
          <div className="step-image-placeholder">
            <span>Image: Formulaire de création de token</span>
          </div>
        </div>
      </div>
      
      <div className="step-container">
        <div className="step-number">4</div>
        <div className="step-content">
          <h2>Configurez les autorisations</h2>
          <p>
            Décidez quelles autorisations vous souhaitez conserver pour votre token :
          </p>
          <ul className="step-list">
            <li><strong>Autorité de mint</strong> : Permet de créer de nouveaux tokens après la création initiale</li>
            <li><strong>Autorité de freeze</strong> : Permet de geler des comptes de token</li>
            <li><strong>Autorité de métadonnées</strong> : Permet de mettre à jour les métadonnées du token</li>
          </ul>
          <div className="step-image-placeholder">
            <span>Image: Configuration des autorisations</span>
          </div>
        </div>
      </div>
      
      <div className="step-container">
        <div className="step-number">5</div>
        <div className="step-content">
          <h2>Ajoutez des informations sociales (optionnel)</h2>
          <p>
            Vous pouvez ajouter des liens vers :
          </p>
          <ul className="step-list">
            <li>Site web</li>
            <li>Twitter</li>
            <li>Discord</li>
            <li>Telegram</li>
          </ul>
          <div className="step-image-placeholder">
            <span>Image: Ajout des liens sociaux</span>
          </div>
        </div>
      </div>
      
      <div className="step-container">
        <div className="step-number">6</div>
        <div className="step-content">
          <h2>Créez votre token</h2>
          <p>
            Cliquez sur le bouton "Créer le Token" et confirmez la transaction dans votre wallet.
            Attendez que la transaction soit confirmée sur la blockchain.
          </p>
          <div className="step-image-placeholder">
            <span>Image: Confirmation de création du token</span>
          </div>
        </div>
      </div>
      
      <div className="step-container">
        <div className="step-number">7</div>
        <div className="step-content">
          <h2>Ajoutez de la liquidité (optionnel)</h2>
          <p>
            Pour permettre l'échange de votre token, vous pouvez créer un pool de liquidité en utilisant notre fonction "Créer Liquidité".
          </p>
          <div className="step-image-placeholder">
            <span>Image: Page de création de liquidité</span>
          </div>
        </div>
      </div>
      
      <div className="final-tip">
        <h3>Conseil</h3>
        <p>
          Pour une meilleure visibilité de votre token, n'oubliez pas d'ajouter une image et une description détaillée.
          Cela aidera les utilisateurs à comprendre l'utilité et la valeur de votre token.
        </p>
      </div>
      
      <div className="final-tip">
        <h3>Note technique</h3>
        <p>
          Token Launcher utilise la bibliothèque Gill pour interagir avec la blockchain Solana. Cette bibliothèque moderne simplifie le processus de création et de gestion des tokens par rapport aux approches traditionnelles.
        </p>
      </div>
    </div>
  );
}