import { useState } from 'react';
import styles from '../styles/MintNFT.module.css';

export default function MintNFT({ onMint }) {
  const [uri, setUri] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uri.trim()) {
      onMint(uri);
      setUri('');
      setShowForm(false);
    }
  };

  const sampleURIs = [
    'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/image.png',
    'https://ipfs.io/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4',
    'My Custom NFT Metadata',
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>NFT 발행</h2>
        <button
          className={styles.toggleButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '닫기' : '새 NFT 발행'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Token URI (이미지 URL 또는 메타데이터):</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="https://... 또는 커스텀 텍스트"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.samples}>
            <p className={styles.samplesTitle}>샘플 URI:</p>
            {sampleURIs.map((sample, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setUri(sample)}
                className={styles.sampleButton}
              >
                샘플 {index + 1}
              </button>
            ))}
          </div>

          <button type="submit" className={styles.mintButton}>
            발행하기
          </button>
        </form>
      )}
    </section>
  );
}
