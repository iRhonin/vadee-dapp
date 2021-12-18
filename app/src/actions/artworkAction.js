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
          e.response && e.response.data.detail
            ? e.response.data.detail
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
        e.response && e.response.data.detail
          ? e.response.data.detail
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
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.message,
    });
  }
};
