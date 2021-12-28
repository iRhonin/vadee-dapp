import artworksBase from '../apis/artworksBase';
import {
  ARTWORK_LIST_REQUEST,
  ARTWORK_LIST_SUCCESS,
  ARTWORK_LIST_FAIL,
  ARTWORK_DETAILS_REQUEST,
  ARTWORK_DETAILS_SUCCESS,
  ARTWORK_DETAILS_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  ARTWORK_UPDATE_REQUEST,
  ARTWORK_UPDATE_FAIL,
  ARTWORK_UPDATE_SUCCESS,
  ARTWORK_VOUCHER_DELETE_FAIL,
  ARTWORK_VOUCHER_DELETE_REQUEST,
  ARTWORK_VOUCHER_DELETE_SUCCESS,
} from '../constants/artworkConstants';

export const fetchAllArtWorks =
  (keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: ARTWORK_LIST_REQUEST });
      const response = await artworksBase.get(`/artworks/${keyword}`);

      dispatch({
        type: ARTWORK_LIST_SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      dispatch({
        type: ARTWORK_LIST_FAIL,
        payload:
          e.response && e.response.data.details
            ? e.response.data.details
            : e.message,
      });
    }
  };

export const fetchOneArtWork = (workId) => async (dispatch) => {
  try {
    await dispatch({ type: ARTWORK_DETAILS_REQUEST });

    const response = await artworksBase.get(`/artworks/${workId}`);

    dispatch({
      type: ARTWORK_DETAILS_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: ARTWORK_DETAILS_FAIL,
      payload:
        e.response && e.response.data.details
          ? e.response.data.details
          : e.message,
    });
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    await dispatch({ type: CATEGORY_LIST_REQUEST });

    const response = await artworksBase.get(`/artworks/categories`);
    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        e.response && e.response.data.details
          ? e.response.data.details
          : e.message,
    });
  }
};

export const updateArtwork =
  (artworkId, galleryAddress, sellerAddress, buyerAddress, voucher, action) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: ARTWORK_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          'content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // eslint-disable-next-line no-undef
      const formData = new FormData();

      // 1 -Option Sign: update product when sign the product
      if (action === 'Signing') {
        formData.append('signature', voucher.signature);
        formData.append('title', voucher.title);
        formData.append('artworkId', voucher.artworkId);
        formData.append('editionNumber', voucher.editionNumber);
        formData.append('edition', voucher.edition);
        formData.append('priceWei', voucher.priceWei);
        formData.append('priceDollar', voucher.priceDollar);
        formData.append('tokenUri', voucher.tokenUri);
        formData.append('content', voucher.content);
      }
      // Option Redeem and Mint: update product when mint the product
      else if (action === 'RedeemAndMint') {
        formData.append('tokenId', artworkId);
        formData.append('galleryAddress', galleryAddress);
      }
      // Option Add to market: create a market sell
      else if (action === 'MarketPlace') {
        formData.append('artworkId', artworkId);
        formData.append('walletAddress', sellerAddress); // seller
        formData.append('galleryAddress', galleryAddress);
      }

      const { data } = await artworksBase.put(
        `/artworks/update/${artworkId}/${action}/`,
        formData,
        config
      );

      dispatch({
        type: ARTWORK_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: ARTWORK_UPDATE_FAIL,
        payload:
          e.response && e.response.data.details
            ? e.response.data.details
            : e.message,
      });
    }
  };

export const deleteVoucher = (voucherId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ARTWORK_VOUCHER_DELETE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await artworksBase.delete(
      `artworks/voucher/${voucherId}/delete/`,
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    dispatch({
      type: ARTWORK_VOUCHER_DELETE_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: ARTWORK_VOUCHER_DELETE_FAIL,
      payload:
        e.response && e.response.data.details
          ? e.response.data.details
          : e.message,
    });
  }
};
