//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract LazyFactory is
    ERC721URIStorage,
    EIP712,
    AccessControl,
    ReentrancyGuard
{
    address payable theMarketPlace;
    address payable theArtist;
    string private constant SIGNING_DOMAIN_NAME = "VADEE";
    string private constant SIGNING_DOMAIN_VERSION = "1";
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 constant VOUCHER_TYPEHASH =
        keccak256(
            "Voucher(string title,uint256 artworkId,uint256 price,string tokenUri,string content)"
        );

    struct Voucher {
        string title;
        uint256 artworkId;
        uint256 price;
        string tokenUri;
        string content;
        bytes signature;
    }

    mapping(address => uint256) private balanceByAddress;

    constructor(
        address payable marketplaceAddress,
        string memory name,
        string memory symbol,
        address payable artist
    ) ERC721(name, symbol) EIP712(SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION) {
        _setupRole(SIGNER_ROLE, artist);
        theMarketPlace = marketplaceAddress;
        theArtist = artist;
    }

    function redeem(
        address buyer,
        Voucher calldata voucher,
        uint256 transactionFee
    ) public payable nonReentrant returns (uint256) {
        address artist = _verify(voucher);
        console.log(voucher.title);
        console.log(voucher.artworkId);
        console.log(voucher.price);
        console.log(msg.value);
        console.log(voucher.content);
        console.log(artist);
        console.log(buyer);

        require(msg.value == voucher.price, "Enter the correct price");
        require(artist != buyer, "You can not purchase your own token");
        require(hasRole(SIGNER_ROLE, artist), "Invalid Signature");

        _mint(artist, voucher.artworkId);
        _setTokenURI(voucher.artworkId, voucher.tokenUri);
        setApprovalForAll(theMarketPlace, true); // sender approves Market Place to transfer tokens

        // transfer the token to the buyer
        _transfer(artist, buyer, voucher.artworkId);

        uint256 amount = msg.value;
        theMarketPlace.transfer(transactionFee);
        payable(artist).transfer(amount - transactionFee);

        return voucher.artworkId;
    }

    function _hash(Voucher calldata voucher) internal view returns (bytes32) {
        return
            // _hashTypedDataV4(bytes32 structHash) → bytes32
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        VOUCHER_TYPEHASH,
                        keccak256(bytes(voucher.title)),
                        voucher.artworkId,
                        voucher.price,
                        keccak256(bytes(voucher.tokenUri)),
                        keccak256(bytes(voucher.content))
                    )
                )
            );
    }

    // returns signer address
    function _verify(Voucher calldata voucher) internal view returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    function getChainID() external view returns (uint256) {
        uint256 id;
        // https://docs.soliditylang.org/en/v0.8.7/yul.html?highlight=chainid#evm-dialect
        assembly {
            id := chainid()
        }
        return id;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC721)
        returns (bool)
    {
        return
            ERC721.supportsInterface(interfaceId) ||
            AccessControl.supportsInterface(interfaceId);
    }
}
