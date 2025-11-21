import { useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/NFTCard.module.css';

export default function NFTCard({ nft, account, onListForSale, onUnlist, onBuy }) {
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [price, setPrice] = useState('');
  const [imageError, setImageError] = useState(false);

  const isOwner = account && nft.owner && account.toLowerCase() === nft.owner.toLowerCase();
  const priceInEth = nft.price ? ethers.formatEther(nft.price) : '0';

  const handleListClick = () => {
    setShowPriceInput(true);
  };

  const handleListSubmit = (e) => {
    e.preventDefault();
    if (price && parseFloat(price) > 0) {
      onListForSale(nft.tokenId, price);
      setPrice('');
      setShowPriceInput(false);
    }
  };

  const handleUnlistClick = () => {
    onUnlist(nft.tokenId);
  };

  const handleBuyClick = () => {
    onBuy(nft.tokenId, nft.price);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {nft.tokenURI.startsWith('http') && !imageError ? (
          <img
            src={nft.tokenURI}
            alt={`NFT #${nft.tokenId}`}
            className={styles.image}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <p>NFT #{nft.tokenId}</p>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3>NFT #{nft.tokenId}</h3>
        <p className={styles.owner}>
          <strong>소유자:</strong> {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
        </p>

        {nft.isForSale && (
          <div className={styles.priceTag}>
            <p className={styles.price}>{priceInEth} ETH</p>
          </div>
        )}

        <div className={styles.actions}>
          {isOwner && !nft.isForSale && !showPriceInput && (
            <button onClick={handleListClick} className={styles.listButton}>
              판매 등록
            </button>
          )}

          {isOwner && showPriceInput && (
            <form onSubmit={handleListSubmit} className={styles.priceForm}>
              <input
                type="number"
                step="0.001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="가격 (ETH)"
                className={styles.priceInput}
                required
              />
              <button type="submit" className={styles.submitButton}>확인</button>
              <button
                type="button"
                onClick={() => setShowPriceInput(false)}
                className={styles.cancelButton}
              >
                취소
              </button>
            </form>
          )}

          {isOwner && nft.isForSale && (
            <button onClick={handleUnlistClick} className={styles.unlistButton}>
              판매 취소
            </button>
          )}

          {!isOwner && nft.isForSale && (
            <button onClick={handleBuyClick} className={styles.buyButton}>
              구매하기
            </button>
          )}
        </div>

        {nft.tokenURI && (
          <p className={styles.uri}>
            {nft.tokenURI.length > 50 ? nft.tokenURI.slice(0, 50) + '...' : nft.tokenURI}
          </p>
        )}
      </div>
    </div>
  );
}
