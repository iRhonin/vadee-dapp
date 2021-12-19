import artworksBase from '../apis/artworksBase';
import {
  ARTIST_BY_ID_FAIL,
  ARTIST_BY_ID_REQUEST,
  ARTIST_BY_ID_SUCCESS,
  ARTIST_LIST_FAIL,
  ARTIST_LIST_REQUEST,
  ARTIST_LIST_SUCCESS,
} from '../constants/artistConstants';

export const fetchArtistById = (id) => async (dispatch) => {
  try {
    console.log(id);
    dispatch({ type: ARTIST_BY_ID_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const response = await artworksBase.get(`artists/${id}/`, config);
    dispatch({
      type: ARTIST_BY_ID_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: ARTIST_BY_ID_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.details
          : e.message,
    });
  }
};

export const fetchArtistList =
  (keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: ARTIST_LIST_REQUEST });

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await artworksBase.get(`artists/${keyword}`, config);
      dispatch({
        type: ARTIST_LIST_SUCCESS,
        payload: data,
      });
    } catch (e) {
      // check for generic and custom message to return using ternary statement
      dispatch({
        type: ARTIST_LIST_FAIL,
        payload:
          e.response && e.response.data.detail
            ? e.response.data.details
            : e.message,
      });
    }
  };
