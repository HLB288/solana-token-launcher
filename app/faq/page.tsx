// app/faq/page.tsx
'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems: FaqItem[] = [
    {
      question: "Qu'est-ce que Token Launcher ?",
      answer: "Token Launcher est une plateforme qui vous permet de créer facilement vos propres tokens sur la blockchain Solana sans avoir besoin de connaissances techniques approfondies en programmation."
    },
    {
      question: "Comment créer un token avec Token Launcher ?",
      answer: "Pour créer un token, connectez votre wallet Solana, accédez à la page 'Créer un Token', remplissez les informations requises comme le nom, le symbole, les décimales et l'offre totale, puis cliquez sur 'Créer le Token'. Une fois la transaction confirmée, votre token sera créé sur le réseau Solana."
    },
    {
      question: "Quels wallets sont compatibles avec Token Launcher ?",
      answer: "Token Launcher est compatible avec plusieurs wallets Solana, notamment Phantom et Solflare."
    },
    {
      question: "Y a-t-il des frais pour créer un token ?",
      answer: "La création d'un token nécessite des frais de transaction sur le réseau Solana. Vous devez disposer de SOL dans votre wallet pour couvrir ces frais. Les frais sont payés directement au réseau Solana et non à Token Launcher."
    },
    {
      question: "Sur quel réseau les tokens sont-ils créés ?",
      answer: "Actuellement, Token Launcher crée des tokens sur le réseau Devnet de Solana. Dans les futures mises à jour, nous prévoyons d'ajouter la prise en charge du réseau principal (Mainnet)."
    },
    {
      question: "Comment puis-je ajouter de la liquidité à mon token ?",
      answer: "Vous pouvez ajouter de la liquidité à votre token en utilisant notre fonction 'Créer Liquidité'. Cette fonctionnalité vous permet de créer un pool de liquidité sur un DEX (échange décentralisé) pour que les utilisateurs puissent échanger votre token."
    },
    {
      question: "Puis-je modifier les propriétés de mon token après sa création ?",
      answer: "Certaines propriétés peuvent être modifiées après la création si vous avez configuré votre token avec les autorisations appropriées. Par exemple, vous pouvez révoquer la capacité de minter de nouveaux tokens, geler des comptes, ou mettre à jour les métadonnées si ces autorisations ont été activées lors de la création."
    },
    {
      question: "Comment puis-je promouvoir mon token ?",
      answer: "Vous pouvez promouvoir votre token en ajoutant des informations sociales telles que le site web, Twitter, Discord ou Telegram. Ces informations aideront votre communauté à trouver et à suivre les actualités concernant votre token."
    },
    {
      question: "Qu'est-ce que la bibliothèque Gill utilisée par Token Launcher ?",
      answer: "Gill est une bibliothèque moderne pour interagir avec la blockchain Solana. Elle simplifie la création de tokens et d'autres opérations sur Solana en offrant une API plus intuitive et typée par rapport aux bibliothèques traditionnelles."
    },
    {
      question: "Comment puis-je voir mon token après sa création ?",
      answer: "Après la création de votre token, vous recevrez l'adresse du token et un lien vers Solana Explorer où vous pourrez voir tous les détails de votre token. Vous pouvez également importer ce token dans votre wallet Solana en utilisant l'adresse du token."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Questions Fréquemment Posées</h1>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div key={index} className={`faq-item ${openItem === index ? 'open' : ''}`}>
            <div className="faq-question" onClick={() => toggleItem(index)}>
              {item.question}
              <span className="faq-icon">{openItem === index ? '−' : '+'}</span>
            </div>
            {openItem === index && (
              <div className="faq-answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}