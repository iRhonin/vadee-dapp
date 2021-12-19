//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
pragma abicoder v2; // required to accept structs as function parameters

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "./MarketPlace.sol";

contract LazyFactory is
    ERC721URIStorage,
    EIP712,
    AccessControl,
    ReentrancyGuard
{
    address payable theMarketPlace;
    string private constant SIGNING_DOMAIN = "VADEE";
    string private constant SIGNATURE_VERSION = "1";
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");

    struct Voucher {
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
    ) ERC721(name, symbol) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        _setupRole(SIGNER_ROLE, artist);
        theMarketPlace = marketplaceAddress;
    }

    function redeem(
        address buyer,
        Voucher calldata voucher,
        uint256 transactionFee
    ) public payable nonReentrant returns (uint256) {
        address signer = _verify(voucher);
        require(signer != buyer, "You can not purchase your own token");
        require(hasRole(SIGNER_ROLE, signer), "Invalid Signature");
        require(msg.value == voucher.price, "Enter the correct price");

        _mint(signer, voucher.artworkId);
        _setTokenURI(voucher.artworkId, voucher.tokenUri);
        setApprovalForAll(theMarketPlace, true); // sender approves Market Place to transfer tokens

        // transfer the token to the buyer
        _transfer(signer, buyer, voucher.artworkId);

        uint256 amount = msg.value;
        address payable artist = payable(signer);
        theMarketPlace.transfer(transactionFee);
        artist.transfer(amount - transactionFee);

        return voucher.artworkId;
    }

    function _hash(Voucher calldata voucher) internal view returns (bytes32) {
        return
            // _hashTypedDataV4(bytes32 structHash) → bytes32
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "Voucher(uint256 artworkId,uint256 price,string tokenUri,string content)"
                        ),
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
