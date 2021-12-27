import { ethers } from 'ethers';
import {
  WALLET_CONNECT_FAIL,
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  BUYER_MINT_AND_REDEEM_FAIL,
  BUYER_MINT_AND_REDEEM_REQUEST,
  BUYER_MINT_AND_REDEEM_SUCCESS,
  DEPLOY_MY_GALLERY_FAIL,
  DEPLOY_MY_GALLERY_REQUEST,
  DEPLOY_MY_GALLERY_SUCCESS,
  SIGN_MY_ITEM_FAIL,
  SIGN_MY_ITEM_REQUEST,
  SIGN_MY_ITEM_SUCCESS,
} from '../constants/lazyFactoryConstants';
import artworksBase from '../apis/artworksBase';
import { Voucher } from '../voucher';
import LazyFactory from '../build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json';

const decimalPlaces = 2;

export const connectWallet = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONNECT_REQUEST });
    window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    dispatch({
      type: WALLET_CONNECT_SUCCESS,
      payload: walletAddress,
    });
  } catch (e) {
    dispatch({
      type: WALLET_CONNECT_FAIL,
      payload: '🦊 Connect to Metamask using the top right button.',
    });
  }
};

export const deployMyGallery =
  (marketPlaceAddress, galleryName) => async (dispatch) => {
    let signerContract;
    let signerFactory;
    try {
      dispatch({ type: DEPLOY_MY_GALLERY_REQUEST });

      window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const { chainId } = await provider.getNetwork();
      console.log(`chain Id here: ${chainId}`);

      signerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        signer
      );

      const artistWalletAddress = await signer.getAddress();
      signerContract = await signerFactory.deploy(
        marketPlaceAddress,
        'VADEE',
        galleryName,
        artistWalletAddress
      );
      await signerContract.deployTransaction.wait(); // loading before confirmed transaction

      dispatch({
        type: DEPLOY_MY_GALLERY_SUCCESS,
        payload: { signerContract, signerFactory, artistWalletAddress },
      });
    } catch (e) {
      console.log({ e });
      console.log('problem deploying: ');
      dispatch({
        type: DEPLOY_MY_GALLERY_FAIL,
        payload:
          e.response && e.response.data.details
            ? e.response.data.details
            : e.message,
      });
    }
  };

export const signMyItem =
  (artistGalleryAddress, artwork, artworkPriceEth, priceInDollar, firstName) =>
  async (dispatch) => {
    let voucher;
    try {
      dispatch({ type: SIGN_MY_ITEM_REQUEST });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const validateAddress = () => {
        if (signerAddress !== artwork.artist.wallet_address) {
          const wallet = artwork.artist.wallet_address;
          const userAccountStart = wallet ? wallet.slice(0, 5) : null;
          const userAccountEnd = wallet ? wallet.slice(-5) : null;
          throw new Error(
            `Please use the wallet ${userAccountStart}...${userAccountEnd}`
          );
        }
      };
      validateAddress();
      const signerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        signer
      );

      const signerContract = await signerFactory.attach(artistGalleryAddress);

      if (signerAddress === artwork.artist.wallet_address) {
        const theSignature = new Voucher({ contract: signerContract, signer });

        const priceInWei = ethers.utils.parseUnits(
          artworkPriceEth.toFixed(4),
          'ether',
          decimalPlaces
        );

        voucher = await theSignature.signTransaction(
          artwork._id,
          artwork.title,
          artwork.edition_number,
          artwork.edition_total,
          priceInWei,
          priceInDollar,
          firstName,
          'tokenUri'
        );

        dispatch({
          type: SIGN_MY_ITEM_SUCCESS,
          payload: { voucher, signerAddress },
        });
      }
    } catch (e) {
      console.log('problem Signing: ');
      console.log(e);
      dispatch({
        type: SIGN_MY_ITEM_FAIL,
        payload:
          e.response && e.response.data.details
            ? e.response.data.details
            : e.message,
      });
    }
  };

export const mintAndRedeem =
  (artworkId, artistGalleryAddress, voucher, price) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: BUYER_MINT_AND_REDEEM_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await artworksBase.get(
        `/market/fees/${price.toString()}`,
        config
      );

      const fee = ethers.utils.parseUnits(
        parseInt(data.transaction_fee_ether).toFixed(6),
        'ether'
      );

      window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const redeemer = provider.getSigner();

      // Returns a new instance of the ContractFactory with the same interface and bytecode, but with a different signer.
      // const redeemerFactory = signerFactory.connect(redeemer);
      const redeemerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        redeemer
      );

      // Return an instance of a Contract attached to address. This is the same as using the Contract constructor
      // with address and this the interface and signerOrProvider passed in when creating the ContractFactory.
      const redeemerContract = redeemerFactory.attach(artistGalleryAddress);
      const redeemerAddress = await redeemer.getAddress();

      const theVoucher = {
        artworkId,
        title: voucher.title,
        editionNumber: voucher.edition_number,
        edition: voucher.edition,
        priceWei: voucher.price_wei,
        priceDollar: voucher.price_dollar,
        tokenUri: voucher.token_Uri,
        content: voucher.content,
        signature: voucher.signature,
      };

      await redeemerContract.redeem(redeemerAddress, theVoucher, fee, {
        value: theVoucher.price,
      });

      dispatch({
        type: BUYER_MINT_AND_REDEEM_SUCCESS,
        payload: voucher,
      });
    } catch (e) {
      console.log('problem buying: ');
      console.log({ e });

      dispatch({
        type: BUYER_MINT_AND_REDEEM_FAIL,
        // eslint-disable-next-line no-nested-ternary
        payload: e.error
          ? e.error.message
          : e.response && e.response.data.details
          ? e.response.data.details
          : e.message,
      });
    }
  };
