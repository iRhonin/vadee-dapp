import {
  ARTIST_BY_ID_FAIL,
  ARTIST_BY_ID_REQUEST,
  ARTIST_BY_ID_RESET,
  ARTIST_BY_ID_SUCCESS,
  ARTIST_LIST_FAIL,
  ARTIST_LIST_REQUEST,
  ARTIST_LIST_RESET,
  ARTIST_LIST_SUCCESS,
} from '../constants/artistConstants';

export const artistByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case ARTIST_BY_ID_REQUEST:
      return { loading: true };
    case ARTIST_BY_ID_SUCCESS:
      return { loading: false, success: true, artist: action.payload };
    case ARTIST_BY_ID_FAIL:
      return { loading: false, error: action.payload };
    case ARTIST_BY_ID_RESET:
      return {};
    default:
      return state;
  }
};

export const artistListReducer = (state = { artists: [] }, action) => {
  switch (action.type) {
    case ARTIST_LIST_REQUEST:
      return { loading: true };
    case ARTIST_LIST_SUCCESS:
      return { loading: false, success: true, artists: action.payload };
    case ARTIST_LIST_FAIL:
      return { loading: false, error: action.payload };
    case ARTIST_LIST_RESET:
      return { artists: [] };
    default:
      return state;
  }
};

// export const artistDetailsReducer = (state = { theArtist: {} }, action) => {
//   switch (action.type) {
//     case ARTIST_DETAILS_REQUEST:
//       return { ...state, loading: true };
//     case ARTIST_DETAILS_SUCCESS:
//       return { loading: false, success: true, theArtist: action.payload };
//     case ARTIST_DETAILS_FAIL:
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };
