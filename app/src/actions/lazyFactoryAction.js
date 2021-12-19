import { ethers } from 'ethers';
import {
  WALLET_CONNECT_FAIL,
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  BUYER_MINT_AND_REDEEM_FAIL,
  BUYER_MINT_AND_REDEEM_REQUEST,
  BUYER_MINT_AND_REDEEM_SUCCESS,
  DEPLOY_MY_STORE_FAIL,
  DEPLOY_MY_STORE_REQUEST,
  DEPLOY_MY_STORE_SUCCESS,
  SIGN_MY_ITEM_FAIL,
  SIGN_MY_ITEM_REQUEST,
  SIGN_MY_ITEM_SUCCESS,
} from '../constants/lazyFactoryConstants';
import artworksBase from '../apis/artworksBase';
import { Voucher } from '../voucher';
import LazyFactory from '../build/contracts/artifacts/contracts/LazyFactory.sol/LazyFactory.json';

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

export const deployMyStore =
  (marketPlaceAddress, storeName) => async (dispatch) => {
    let signerContract;
    let signerFactory;
    try {
      dispatch({ type: DEPLOY_MY_STORE_REQUEST });

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

      signerContract = await signerFactory.deploy(
        marketPlaceAddress,
        'VADEE',
        storeName,
        signer.getAddress()
      );
      await signerContract.deployTransaction.wait(); // loading before confirmed transaction

      dispatch({
        type: DEPLOY_MY_STORE_SUCCESS,
        payload: { signerContract, signerFactory },
      });
    } catch (e) {
      console.log({ e });
      console.log('problem deploying: ');
      dispatch({
        type: DEPLOY_MY_STORE_FAIL,
        payload:
          e.response && e.response.data.detail
            ? e.response.data.detail
            : e.message,
      });
    }
  };

export const signMyItem =
  (signerContractAddress, artworkId, title, price, firstName, tokenUri) =>
  async (dispatch) => {
    let voucher;
    try {
      dispatch({ type: SIGN_MY_ITEM_REQUEST });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      const sellingPrice = ethers.utils.parseUnits(price.toString(), 'ether');
      const signerFactory = new ethers.ContractFactory(
        LazyFactory.abi,
        LazyFactory.bytecode,
        signer
      );

      const signerContract = await signerFactory.attach(signerContractAddress);

      const theSignature = new Voucher({ contract: signerContract, signer });

      voucher = await theSignature.signTransaction(
        artworkId,
        title,
        sellingPrice,
        firstName,
        tokenUri
      );

      dispatch({
        type: SIGN_MY_ITEM_SUCCESS,
        payload: { voucher, signerAddress },
      });
    } catch (e) {
      console.log('problem Signing: ');
      console.log(e);
      dispatch({
        type: SIGN_MY_ITEM_FAIL,
        payload:
          e.response && e.response.data.detail
            ? e.response.data.detail
            : e.message,
      });
    }
  };

export const mintAndRedeem =
  (artworkId, signerContractAddress, voucher, price) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: BUYER_MINT_AND_REDEEM_REQUEST });
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
      const redeemerContract = redeemerFactory.attach(signerContractAddress);
      const redeemerAddress = await redeemer.getAddress();

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
        data.transaction_fee.toString(),
        'ether'
      );

      const sellingPrice = ethers.utils.parseUnits(price.toString(), 'ether');

      const theVoucher = {
        artworkId,
        sellingPrice,
        tokenUri: voucher.token_Uri,
        content: voucher.content,
        signature: voucher.signature,
      };

      await redeemerContract.redeem(redeemerAddress, theVoucher, fee, {
        value: sellingPrice,
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
        payload:
          e.response && e.response.data.detail
            ? e.response.data.detail
            : e.message,
      });
    }
  };
