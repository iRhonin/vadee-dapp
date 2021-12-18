import {
  ARTWORK_LIST_REQUEST,
  ARTWORK_LIST_SUCCESS,
  ARTWORK_LIST_FAIL,
  ARTWORK_LIST_RESET,
  ARTWORK_DELETE_REQUEST,
  ARTWORK_DELETE_SUCCESS,
  ARTWORK_DELETE_FAIL,
  ARTWORK_DELETE_RESET,
} from '../constants/artworkConstants';

export const artworksReducer = (state = { artworks: [] }, action) => {
  switch (action.type) {
    case ARTWORK_LIST_REQUEST:
      return { loading: true, artworks: [] };
    case ARTWORK_LIST_SUCCESS:
      return {
        loading: false,
        artworks: action.payload.artworks,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case ARTWORK_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ARTWORK_LIST_RESET:
      return { artworks: [] };
    default:
      return state;
  }
};

export const artworkDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case ARTWORK_DELETE_REQUEST:
      return { loading: true };
    case ARTWORK_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ARTWORK_DELETE_FAIL:
      return { loading: false, error: action.payload };
    case ARTWORK_DELETE_RESET:
      return {};
    default:
      return state;
  }
};
