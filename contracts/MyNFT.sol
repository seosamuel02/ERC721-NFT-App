// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    struct NFTItem {
        uint256 tokenId;
        address owner;
        string tokenURI;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => NFTItem) public nftItems;
    mapping(uint256 => uint256) public tokenPrices;

    event NFTMinted(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event NFTListedForSale(uint256 indexed tokenId, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);
    event NFTBurned(uint256 indexed tokenId, address indexed owner);
    event NFTTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor() ERC721("SeoDongMin NFT", "SDMNFT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    function mintNFT(address to, string memory uri) public returns (uint256) {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        nftItems[tokenId] = NFTItem({
            tokenId: tokenId,
            owner: to,
            tokenURI: uri,
            price: 0,
            isForSale: false
        });

        emit NFTMinted(tokenId, to, uri);
        return tokenId;
    }

    function burnNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        require(!nftItems[tokenId].isForSale, "Cannot burn NFT that is listed for sale");

        address owner = ownerOf(tokenId);

        delete nftItems[tokenId];
        delete tokenPrices[tokenId];

        _burn(tokenId);

        emit NFTBurned(tokenId, owner);
    }

    function transferNFT(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        require(!nftItems[tokenId].isForSale, "Cannot transfer NFT that is listed for sale");
        require(to != address(0), "Cannot transfer to zero address");

        address from = msg.sender;

        nftItems[tokenId].owner = to;
        nftItems[tokenId].price = 0;
        nftItems[tokenId].isForSale = false;

        safeTransferFrom(from, to, tokenId);

        emit NFTTransferred(tokenId, from, to);
    }

    function listNFTForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        require(price > 0, "Price must be greater than zero");

        nftItems[tokenId].price = price;
        nftItems[tokenId].isForSale = true;
        tokenPrices[tokenId] = price;

        emit NFTListedForSale(tokenId, price);
    }

    function unlistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");

        nftItems[tokenId].price = 0;
        nftItems[tokenId].isForSale = false;
        tokenPrices[tokenId] = 0;

        emit NFTUnlisted(tokenId);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(nftItems[tokenId].isForSale, "NFT is not for sale");
        require(msg.value >= nftItems[tokenId].price, "Insufficient payment");

        address previousOwner = ownerOf(tokenId);
        uint256 price = nftItems[tokenId].price;

        nftItems[tokenId].isForSale = false;
        nftItems[tokenId].price = 0;
        nftItems[tokenId].owner = msg.sender;
        tokenPrices[tokenId] = 0;

        _transfer(previousOwner, msg.sender, tokenId);

        payable(previousOwner).transfer(msg.value);

        emit NFTSold(tokenId, previousOwner, msg.sender, price);
    }

    function getAllNFTs() public view returns (NFTItem[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0)) {
                activeCount++;
            }
        }

        NFTItem[] memory items = new NFTItem[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0)) {
                items[currentIndex] = NFTItem({
                    tokenId: i,
                    owner: ownerOf(i),
                    tokenURI: tokenURI(i),
                    price: nftItems[i].price,
                    isForSale: nftItems[i].isForSale
                });
                currentIndex++;
            }
        }

        return items;
    }

    function getMyNFTs(address owner) public view returns (NFTItem[] memory) {
        uint256 balance = balanceOf(owner);
        NFTItem[] memory myNFTs = new NFTItem[](balance);
        uint256 counter = 0;

        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (_ownerOf(i) == owner) {
                myNFTs[counter] = NFTItem({
                    tokenId: i,
                    owner: owner,
                    tokenURI: tokenURI(i),
                    price: nftItems[i].price,
                    isForSale: nftItems[i].isForSale
                });
                counter++;
            }
        }

        return myNFTs;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
