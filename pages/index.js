import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTCard from '../components/NFTCard';
import MintNFT from '../components/MintNFT';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [allNFTs, setAllNFTs] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const contractABI = [
    "function mintNFT(address to, string memory uri) public returns (uint256)",
    "function getAllNFTs() public view returns (tuple(uint256 tokenId, address owner, string tokenURI, uint256 price, bool isForSale)[])",
    "function getMyNFTs(address owner) public view returns (tuple(uint256 tokenId, address owner, string tokenURI, uint256 price, bool isForSale)[])",
    "function listNFTForSale(uint256 tokenId, uint256 price) public",
    "function unlistNFT(uint256 tokenId) public",
    "function buyNFT(uint256 tokenId) public payable",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function tokenURI(uint256 tokenId) public view returns (string memory)"
  ];

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (contract && account) {
      loadNFTs();
    }
  }, [contract, account]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("MetaMask를 설치해주세요!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setAccount(account);
        setupProvider(account);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("MetaMask를 설치해주세요!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setupProvider(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const setupProvider = async (account) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setProvider(provider);
    setSigner(signer);

    try {
      const response = await fetch('/deployment-info.json');
      const data = await response.json();
      setContractAddress(data.contractAddress);
      setOwnerAddress(data.ownerAddress);

      const contract = new ethers.Contract(data.contractAddress, contractABI, signer);
      setContract(contract);
    } catch (error) {
      console.log("배포 정보를 불러올 수 없습니다. 컨트랙트를 먼저 배포해주세요.");
    }
  };

  const loadNFTs = async () => {
    try {
      const all = await contract.getAllNFTs();
      const my = await contract.getMyNFTs(account);

      const formattedAll = all.map(nft => ({
        tokenId: Number(nft.tokenId),
        owner: nft.owner,
        tokenURI: nft.tokenURI,
        price: nft.price,
        isForSale: nft.isForSale
      })).filter(nft => nft.owner !== ethers.ZeroAddress);

      const formattedMy = my.map(nft => ({
        tokenId: Number(nft.tokenId),
        owner: nft.owner,
        tokenURI: nft.tokenURI,
        price: nft.price,
        isForSale: nft.isForSale
      })).filter(nft => nft.owner !== ethers.ZeroAddress);

      setAllNFTs(formattedAll);
      setMyNFTs(formattedMy);
    } catch (error) {
      console.error("NFT 로딩 실패:", error);
    }
  };

  const handleMint = async (uri) => {
    if (!contract) return;
    try {
      const tx = await contract.mintNFT(account, uri);
      await tx.wait();
      alert("NFT 발행 완료!");
      loadNFTs();
    } catch (error) {
      console.error("발행 실패:", error);
      alert("발행 실패: " + error.message);
    }
  };

  const handleListForSale = async (tokenId, price) => {
    if (!contract) return;
    try {
      const priceInWei = ethers.parseEther(price.toString());
      const tx = await contract.listNFTForSale(tokenId, priceInWei);
      await tx.wait();
      alert("판매 등록 완료!");
      loadNFTs();
    } catch (error) {
      console.error("판매 등록 실패:", error);
      alert("판매 등록 실패: " + error.message);
    }
  };

  const handleUnlist = async (tokenId) => {
    if (!contract) return;
    try {
      const tx = await contract.unlistNFT(tokenId);
      await tx.wait();
      alert("판매 취소 완료!");
      loadNFTs();
    } catch (error) {
      console.error("판매 취소 실패:", error);
      alert("판매 취소 실패: " + error.message);
    }
  };

  const handleBuy = async (tokenId, price) => {
    if (!contract) return;
    try {
      const tx = await contract.buyNFT(tokenId, { value: price });
      await tx.wait();
      alert("구매 완료!");
      loadNFTs();
    } catch (error) {
      console.error("구매 실패:", error);
      alert("구매 실패: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ERC-721 NFT Marketplace</h1>
        <div className={styles.studentInfo}>
          <p><strong>학번:</strong> 92113669</p>
          <p><strong>이름:</strong> 서동민</p>
        </div>
      </header>

      <main className={styles.main}>
        {!account ? (
          <button className={styles.connectButton} onClick={connectWallet}>
            MetaMask 연결
          </button>
        ) : (
          <div className={styles.content}>
            <section className={styles.infoSection}>
              <h2>계정 정보</h2>
              <div className={styles.infoCard}>
                <p><strong>연결된 지갑:</strong></p>
                <p className={styles.address}>{account}</p>
                <p><strong>컨트랙트 주소:</strong></p>
                <p className={styles.address}>{contractAddress || '배포되지 않음'}</p>
                <p><strong>소유자 주소:</strong></p>
                <p className={styles.address}>{ownerAddress || '배포되지 않음'}</p>
              </div>
            </section>

            {contract && (
              <>
                <MintNFT onMint={handleMint} />

                <section className={styles.nftSection}>
                  <div className={styles.tabs}>
                    <button
                      className={activeTab === 'all' ? styles.activeTab : styles.tab}
                      onClick={() => setActiveTab('all')}
                    >
                      모든 NFT ({allNFTs.length})
                    </button>
                    <button
                      className={activeTab === 'my' ? styles.activeTab : styles.tab}
                      onClick={() => setActiveTab('my')}
                    >
                      내 NFT ({myNFTs.length})
                    </button>
                  </div>

                  <div className={styles.nftGrid}>
                    {activeTab === 'all' && allNFTs.length === 0 && (
                      <p className={styles.emptyMessage}>아직 발행된 NFT가 없습니다.</p>
                    )}
                    {activeTab === 'my' && myNFTs.length === 0 && (
                      <p className={styles.emptyMessage}>아직 소유한 NFT가 없습니다.</p>
                    )}
                    {activeTab === 'all' &&
                      allNFTs.map((nft) => (
                        <NFTCard
                          key={nft.tokenId}
                          nft={nft}
                          account={account}
                          onListForSale={handleListForSale}
                          onUnlist={handleUnlist}
                          onBuy={handleBuy}
                        />
                      ))}
                    {activeTab === 'my' &&
                      myNFTs.map((nft) => (
                        <NFTCard
                          key={nft.tokenId}
                          nft={nft}
                          account={account}
                          onListForSale={handleListForSale}
                          onUnlist={handleUnlist}
                          onBuy={handleBuy}
                        />
                      ))}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>ERC-721 NFT Marketplace - Sepolia Testnet</p>
      </footer>
    </div>
  );
}
