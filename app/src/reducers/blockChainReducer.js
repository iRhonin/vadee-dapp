import {
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  WALLET_CONNECT_FAIL,
} from '../constants/blockChainConstants';

export const walletConnectionReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_CONNECT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case WALLET_CONNECT_SUCCESS:
      return {
        loading: false,
        success: true,
        wallet: action.payload,
      };
    case WALLET_CONNECT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
