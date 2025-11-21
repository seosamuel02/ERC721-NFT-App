# ERC-721 NFT Marketplace DApp

학번: 92113669
이름: 서동민

## 프로젝트 개요

ERC-721 표준 NFT 컨트랙트 및 마켓플레이스 DApp 구현 프로젝트입니다.

## 기능

### NFT 기능
- **NFT 발행 (Mint)**: 새로운 NFT 생성
- **NFT 조회**: 모든 NFT 및 내 NFT 확인
- **NFT 메타데이터**: Token URI 저장 및 조회

### 마켓플레이스 기능
- **판매 등록**: NFT를 원하는 가격에 판매 등록
- **판매 취소**: 등록된 NFT 판매 취소
- **NFT 구매**: 판매 중인 NFT 구매

## 기술 스택

- **Smart Contract**: Solidity 0.8.20, OpenZeppelin Contracts (ERC721, ERC721URIStorage, Ownable)
- **Frontend**: Next.js, React, ethers.js
- **Development**: Hardhat
- **Network**: Sepolia Testnet
- **Deployment**: Vercel

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 입력:

```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-private-key-here
```

### 3. 스마트 컨트랙트 컴파일

```bash
npm run compile
```

### 4. 스마트 컨트랙트 배포 (Sepolia)

```bash
npm run deploy
```

배포 후 `deployment-info.json` 파일이 생성되며, 이 파일을 `public/` 폴더로 복사:

```bash
cp deployment-info.json public/
```

### 5. 프론트엔드 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 배포 정보

- **컨트랙트 주소**: [배포 후 기입]
- **소유자 주소**: [배포 후 기입]
- **네트워크**: Sepolia Testnet
- **배포된 앱**: [Vercel URL]

## 스마트 컨트랙트

### MyNFT.sol

OpenZeppelin의 ERC721, ERC721URIStorage, Ownable을 상속받아 구현:

- `name`: "SeoDongMin NFT"
- `symbol`: "SDMNFT"
- **NFT 발행**: `mintNFT(address to, string memory uri)`
- **판매 등록**: `listNFTForSale(uint256 tokenId, uint256 price)`
- **판매 취소**: `unlistNFT(uint256 tokenId)`
- **NFT 구매**: `buyNFT(uint256 tokenId) payable`
- **전체 NFT 조회**: `getAllNFTs()`
- **내 NFT 조회**: `getMyNFTs(address owner)`

## 사용 방법

1. MetaMask 지갑 연결 (Sepolia 네트워크)
2. 컨트랙트 정보 확인
3. NFT 발행 (Token URI 입력)
4. NFT 판매 등록 또는 구매

## 특징

- 완전한 NFT 마켓플레이스 기능
- 직관적인 UI/UX
- 실시간 NFT 상태 업데이트
- 이미지 URL 지원 (IPFS 등)
- 반응형 디자인

## 라이선스

MIT
